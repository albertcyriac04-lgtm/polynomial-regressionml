"""
train.py - Train a Polynomial Regression model and save it as model.pkl
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import joblib
import os

# Load dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
df = pd.read_csv(os.path.join(BASE_DIR, "salary_experience_dataset.csv"))

X = df[["Experience_Years"]]
y = df["Salary"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create polynomial regression pipeline (degree=3, matching the notebook)
degree = 3
model = Pipeline([
    ("poly", PolynomialFeatures(degree=degree)),
    ("linear", LinearRegression())
])

# Train
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
r2 = r2_score(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)

print(f"Polynomial Regression (Degree={degree})")
print(f"  R² Score : {r2:.6f}")
print(f"  MSE      : {mse:.2f}")

# Save model
model_path = os.path.join(BASE_DIR, "model.pkl")
joblib.dump(model, model_path)
print(f"\nModel saved to {model_path}")
