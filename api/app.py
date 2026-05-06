from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import joblib
import numpy as np
import os

# Get root path from environment variable (set by Codespaces proxy)
root_path = os.getenv("ROOT_PATH", "")

app = FastAPI(
    title="PCOS Risk Prediction API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    root_path=root_path
)

# Add CORS middleware for cross-origin requests through proxy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "ml-service"))

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml-service", "models", "pcos_risk_model.pkl")
model = joblib.load(MODEL_PATH)

class PCOSInput(BaseModel):
    age: int
    weight: float
    height: float
    bmi: float
    cycle_length: int
    follicle_count: int
    acne: int
    hair_growth: int

class PredictionOutput(BaseModel):
    prediction: int
    probability: float

@app.get("/")
def home():
    return {"message": "PCOS Risk Prediction API is running"}

@app.post("/predict", response_model=PredictionOutput)
def predict(data: PCOSInput):
    input_data = np.array([[ 
        data.age, data.weight, data.height, data.bmi,
        data.cycle_length, data.follicle_count,
        data.acne, data.hair_growth
    ]])

    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1]

    return {
        "prediction": int(prediction),
        "probability": float(probability)
    }
