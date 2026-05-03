import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load the trained ML model globally when the app starts
model_path = os.path.join(os.path.dirname(__file__), 'cost_prediction_model.pkl')
try:
    with open(model_path, 'rb') as f:
        model_pipeline = pickle.load(f)
    print("Cost Prediction Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model_pipeline = None

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
        
        return jsonify({
            'success': True,
            'predicted_cost': round(predicted_cost, 2)
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)
