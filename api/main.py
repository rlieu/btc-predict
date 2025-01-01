import os
import sys
sys.path.append("../")

import joblib
from fastapi import FastAPI
from pydantic import BaseModel
from services.scraper import save_current_prices
from services.coinmarketcap import save_historical_price
from services.utils import model_forecast

if os.getenv("RUN_ENV") == "docker":
    model_path = "/app/api/model.joblib"
else:
    model_path = "model.joblib"

model = joblib.load(model_path)

app = FastAPI()

class PredictInput(BaseModel):
    series: list

class CurrentPriceInput(BaseModel):
    url: str | None = None

class HistoricalPriceInput(BaseModel):
    symbol: str

@app.post("/predict")
def predict(data: PredictInput):
    prediction = model_forecast(model, data.series)
    return prediction.tolist()

@app.post("/save-current-prices")
def save_current_prices(data: CurrentPriceInput | None = None):

    return save_current_prices(data.url)

@app.post("/save-historical-price")
def save_historical_prices(data: HistoricalPriceInput):

    return save_historical_price(data.symbol)
