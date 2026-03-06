"""
app.py - Flask web application for Polynomial Regression predictions
"""
from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

model = None

def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("Model loaded successfully.")
    else:
        print(f"WARNING: Model file not found at {MODEL_PATH}")
        print("Run 'python train.py' first to generate the model.")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        experience = float(data.get("experience", 0))

        if experience < 0:
            return jsonify({"error": "Experience years cannot be negative."}), 400

        if model is None:
            return jsonify({"error": "Model not loaded. Run train.py first."}), 500

        X_input = np.array([[experience]])
        prediction = model.predict(X_input)[0]

        return jsonify({
            "experience": experience,
            "predicted_salary": round(float(prediction), 2)
        })

    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


if __name__ == "__main__":
    load_model()
    app.run(host="0.0.0.0", port=5000, debug=True)
