import os
import requests
import pandas as pd

API_KEY = os.environ.get("API_KEY")
url = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical"

headers = {
    "Accepts": "application/json",
    "X-CMC_PRO_API_KEY": API_KEY,
}

def save_historical_price(symbol, interval="24h", count=100):
  parameters = {
    "symbol": symbol,
    "convert": "USD",
    "interval": interval,
    "count": count
  }

  try:
    response = requests.get(url, headers=headers, params=parameters)
    response.raise_for_status()  # Raise exception for HTTP errors
    data = response.json()
    print("DATA: ", data)
    
    quotes = data["data"][symbol][0]["quotes"]
    all_quotes = [item["quote"]["USD"] for item in quotes]
    print("QUOTES: ", all_quotes)

    df_quotes = pd.DataFrame(all_quotes)
    df_quotes.to_csv(f"../data/quotes_{symbol}.csv")

    return all_quotes
  except Exception as e:
    print(e)
    return "Error saving historical price data."