import sys
sys.path.append("../")

import joblib
from flask import Flask, request
from services.scraper import save_current_prices
from services.coinmarketcap import save_historical_price
from services.utils import model_forecast

model = joblib.load("model.joblib")

app = Flask(__name__)

@app.route("/predict", methods=['POST'])
def predict():
    if request.method == 'POST':
        data = request.get_json()
        print(data)

        series = data.get('series')
        if not series:
            return "No series data provided."
        
        #get prediction
        prediction = model_forecast(model, series)
        return prediction.tolist()

@app.route("/save-current-prices", methods=['POST'])
def save_current_prices():
    data = request.get_json()
    print(data)

    return save_current_prices(data.get('url'))

@app.route("/save-historical-price", methods=['POST'])
def save_historical_prices():
    data = request.get_json()
    print(data)

    symbol = data.get('symbol')
    if not symbol:
        return "No cryptocurrency symbol provided."

    return save_historical_price(symbol)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
