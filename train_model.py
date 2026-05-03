import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import pickle

def main():
    print("Loading dataset...")
    # Load the JSON dataset
    with open("uttarakhand_tourism_dataset.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    # Convert to DataFrame
    df = pd.DataFrame(data)

    print("Creating features...")
    # Create a feature string combining useful textual attributes
    def build_features(row):
        features = []
        if isinstance(row.get('trip_types'), list):
            features.extend(row['trip_types'])
        if isinstance(row.get('activities_available'), list):
            features.extend(row['activities_available'])
        if isinstance(row.get('primary_attractions'), list):
            features.extend(row['primary_attractions'])
        if isinstance(row.get('ideal_for'), list):
            features.extend(row['ideal_for'])
        return " ".join(features).lower()

    df['combined_features'] = df.apply(build_features, axis=1)

    print("Training TF-IDF Vectorizer...")
    # Convert textual features to numerical vectors
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['combined_features'])

    print("Training NearestNeighbors model...")
    # Train the Nearest Neighbors model
    model = NearestNeighbors(metric='cosine', algorithm='brute')
    model.fit(tfidf_matrix)

    print("Saving model to recommendation_model.pkl...")
    # Save the necessary components
    with open("recommendation_model.pkl", "wb") as f:
        pickle.dump({
            "model": model,
            "vectorizer": tfidf,
            "data": df[['id', 'destination_name', 'state', 'combined_features']].to_dict(orient="records")
        }, f)

    print("Model saved successfully!")

    # Load and test the model
    print("\nTesting the model with a sample query: 'spiritual yoga meditation'")
    test_query = "spiritual yoga meditation"
    test_vector = tfidf.transform([test_query])
    distances, indices = model.kneighbors(test_vector, n_neighbors=3)

    print("\nTop 3 Recommendations:")
    for idx in indices[0]:
        print(f"- {df.iloc[idx]['destination_name']}")

if __name__ == "__main__":
    main()
