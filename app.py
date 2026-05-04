import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
app = Flask(__name__)
CORS(app)

# MongoDB Configuration
MONGO_URI = "mongodb+srv://kanakpreet01_db_user:filMUYe0kwbPG8S2@cluster0.57ttajm.mongodb.net/?appName=Cluster0"
try:
    client = MongoClient(MONGO_URI)
    db = client.tourism_app # Database name
    users_collection = db.users
    guides_collection = db.guides
    print("MongoDB Connected Successfully.")
except Exception as e:
    print(f"MongoDB Connection Error: {e}")


# Load the trained ML model globally when the app starts
model_path = os.path.join(os.path.dirname(__file__), 'cost_prediction_model.pkl')
try:
    with open(model_path, 'rb') as f:
        model_pipeline = pickle.load(f)
    print("Cost Prediction Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model_pipeline = None

# --- AUTHENTICATION ENDPOINTS ---

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"success": False, "error": "Email and password required."}), 400
        
    if users_collection.find_one({"email": email}):
        return jsonify({"success": False, "error": "An account already exists with that email. Try signing in."}), 400
        
    hashed_password = generate_password_hash(password)
    new_user = {
        "email": email,
        "password": hashed_password,
        "role": "user",
        "created_at": datetime.datetime.now(datetime.timezone.utc)
    }
    
    users_collection.insert_one(new_user)
    return jsonify({"success": True, "user": {"email": email}}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"success": False, "error": "Email and password required."}), 400
        
    user = users_collection.find_one({"email": email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"success": False, "error": "Login failed! That account doesn't exist or wrong password."}), 401
        
    return jsonify({"success": True, "user": {"email": email, "role": user.get('role', 'user')}}), 200

@app.route('/api/register_guide', methods=['POST'])
def register_guide():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    
    if not all([name, email, password, phone]):
        return jsonify({"success": False, "error": "All fields are required."}), 400
        
    if users_collection.find_one({"email": email}):
        return jsonify({"success": False, "error": "An account already exists with that email."}), 400
        
    hashed_password = generate_password_hash(password)
    
    # Store auth logic in users collection
    new_user = {
        "email": email,
        "password": hashed_password,
        "role": "guide",
        "created_at": datetime.datetime.now(datetime.timezone.utc)
    }
    user_result = users_collection.insert_one(new_user)
    
    # Store guide profile in guides collection
    new_guide = {
        "user_id": str(user_result.inserted_id),
        "name": name,
        "email": email,
        "phone": phone,
        "registeredAt": datetime.datetime.now(datetime.timezone.utc)
    }
    guides_collection.insert_one(new_guide)
    
    return jsonify({"success": True, "user": {"email": email, "name": name, "role": "guide"}}), 201

# --- ML ENDPOINTS ---


@app.route('/api/predict_cost', methods=['POST'])
def predict_cost():
    if not model_pipeline:
        return jsonify({'error': 'Model not loaded.'}), 500

    data = request.json
    try:
        # Create a DataFrame from the incoming JSON
        # Must match the features used during training
        trip_df = pd.DataFrame([{
            'source_city': data.get('source_city', 'Delhi'),
            'destination_city': data.get('destination_city', 'Rishikesh'),
            'transport_type': data.get('transport_type', 'bus'),
            'hotel_type': data.get('hotel_type', 'standard'),
            'season': data.get('season', 'shoulder'),
            'distance_km': float(data.get('distance_km', 300)),
            'days': int(data.get('days', 3)),
            'people': int(data.get('people', 2))
        }])

        # Predict cost using the loaded pipeline
        predicted_cost = model_pipeline.predict(trip_df)[0]
        
        # Calculate Confidence Band using standard deviation of individual trees
        rf_model = model_pipeline.named_steps['regressor']
        transformed_X = model_pipeline.named_steps['preprocessor'].transform(trip_df)
        preds = [tree.predict(transformed_X)[0] for tree in rf_model.estimators_]
        std_dev = float(np.std(preds))
        confidence_lower = round(predicted_cost - std_dev, 2)
        confidence_upper = round(predicted_cost + std_dev, 2)
        
        # Top Contributing Factors
        factors = []
        hotel = trip_df['hotel_type'].iloc[0]
        transport = trip_df['transport_type'].iloc[0]
        season = trip_df['season'].iloc[0]
        days = trip_df['days'].iloc[0]
        source = trip_df['source_city'].iloc[0]
        
        if hotel in ['luxury', 'deluxe']:
            factors.append(f"{hotel} stay")
        if transport == 'flight':
            factors.append(f"flight from {source}")
        if season in ['peak_summer', 'winter_peak', 'festive']:
            factors.append(f"{season.replace('_', ' ')} season")
        if days > 4:
            factors.append(f"{days} days duration")
            
        if len(factors) > 0:
            factors_text = "Cost is high because you selected " + " + ".join(factors) + "."
        else:
            factors_text = "Cost is relatively optimal based on your budget-friendly selections."
            
        # Cost Reduction Tip (Counterfactual)
        tip_text = "You're already using cost-effective options!"
        if len(factors) > 0:
            cf_df = trip_df.copy()
            if hotel in ['luxury', 'deluxe']:
                cf_df['hotel_type'] = 'standard'
            if transport == 'flight':
                cf_df['transport_type'] = 'train'
            if season in ['peak_summer', 'winter_peak', 'festive']:
                cf_df['season'] = 'shoulder'
                
            cf_cost = model_pipeline.predict(cf_df)[0]
            if cf_cost < predicted_cost:
                reduction_pct = int(((predicted_cost - cf_cost) / predicted_cost) * 100)
                changes = []
                if hotel in ['luxury', 'deluxe']: changes.append("a standard hotel")
                if transport == 'flight': changes.append("taking a train")
                if season in ['peak_summer', 'winter_peak', 'festive']: changes.append("traveling in shoulder season")
                tip_text = f"You could reduce cost by ~{reduction_pct}% (approx ₹{int(predicted_cost - cf_cost):,}) by switching to " + " and ".join(changes) + "."

        return jsonify({
            'success': True,
            'predicted_cost': round(predicted_cost, 2),
            'confidence_band': [confidence_lower, confidence_upper],
            'factors_text': factors_text,
            'tip_text': tip_text
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({'error': str(e)}), 400

# --- STATIC FILE SERVING ---

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)
