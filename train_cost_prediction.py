import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score
import pickle

def main():
    print("Loading dataset...")
    # Load the JSON dataset from the parent directory as specified
    dataset_path = "cost_prediction_dataset.json"
    with open(dataset_path, "r", encoding="utf-8") as f:
        full_json = json.load(f)
    
    # The actual records are inside the 'data' key
    df = pd.DataFrame(full_json['data'])

    print(f"Loaded {len(df)} records. Preparing features...")

    # Define our features (X) and target (y)
    # Target: We want to predict total_cost
    y = df['total_cost']

    # Features: The inputs the user will provide
    categorical_features = ['source_city', 'destination_city', 'transport_type', 'hotel_type', 'season']
    numerical_features = ['distance_km', 'days', 'people']

    X = df[categorical_features + numerical_features]

    print("Building preprocessing pipeline...")
    # Create the preprocessing steps
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])

    print("Defining Random Forest model...")
    # Create the full pipeline: Preprocessor -> Random Forest Regressor
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])

    # Split the data into training and testing sets to evaluate performance
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training the model... this may take a few seconds.")
    # Train the model
    model_pipeline.fit(X_train, y_train)

    print("Evaluating model performance...")
    # Predict on the test set
    y_pred = model_pipeline.predict(X_test)
    
    # Calculate metrics
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Model Mean Absolute Error: Rs. {mae:,.2f}")
    print(f"Model R² Score: {r2:.4f} (1.0 is perfect prediction)")

    print("\nSaving model to cost_prediction_model.pkl...")
    # Save the pipeline to a file
    with open("cost_prediction_model.pkl", "wb") as f:
        pickle.dump(model_pipeline, f)

    print("Model saved successfully!\n")

    # ----- Verification / Test Query -----
    print("Testing the model with a sample trip query:")
    test_trip = pd.DataFrame([{
        'source_city': 'Delhi',
        'destination_city': 'Auli',
        'transport_type': 'flight',
        'hotel_type': 'deluxe',
        'season': 'winter_peak',
        'distance_km': 500,
        'days': 4,
        'people': 2
    }])
    
    predicted_cost = model_pipeline.predict(test_trip)[0]
    print(f"Sample Trip: 2 people from Delhi to Auli for 4 days, Deluxe Hotel in Winter Peak.")
    print(f"Predicted Total Cost: Rs. {predicted_cost:,.2f}")

if __name__ == "__main__":
    main()
