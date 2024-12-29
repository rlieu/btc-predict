# BTC Price Forecasting

## Data Collection
### The following services are available

#### [coinmarketcap](./services/coinmarketcap.py)

1. Fetch price history using the [CoinMarketCap API](https://coinmarketcap.com/api/)  
2. Save data to [CSV](./data/quotes_BTC.csv)

#### [scraper](./services/scraper.py)

1. Get current price, volume, and market cap data using AgentQL and Playwright  
2. Save data to [CSV](./data/price_data.csv)

## Model Training and Selection
### The following is performed in [arma_statsmodels.ipynb](./notebooks/arma_statsmodels.ipynb)

1. Create DataFrame using CSV  
2. Predict the future price of BTC using the Autoregressive Moving Average (ARMA) Model  
3. Plot the results

### The following is performed in [lstm_tensorflow.ipynb](./notebooks/lstm_tensorflow.ipynb)

1. Create DataFrame using CSV  
2. Create sequences of timeseries windows for historical BTC prices  
3. Split data into train / test sets  
4. Tune hyperparameters  
5. Build and train LSTM model  
6. Save best model to joblib file  
7. Plot the results

### The following is performed in [lstm_pytorch.ipynb](./notebooks/lstm_pytorch.ipynb)

1. Create DataFrame using CSV  
2. Create sequences of timeseries windows for historical BTC prices  
3. Split data into train / test sets  
4. Tune hyperparameters (TODO)  
5. Build and train LSTM model  
6. Plot the results

## Applications

### Next.js web app for [Chat UI](./web/README.md)
- Wrapper for [OpenAI API](https://platform.openai.com/docs/overview)  
- TODO: add agent tools and connect with [FastAPI Routes](#fastapi-routes)

### FastAPI Routes

```
cd api/
fastapi dev main.py
```

1. /predict - loads the pretrained model to make predictions  
- expects JSON `series` key and list as values
```
{
  "series": [x0, x1, ... xt]
}
```

2. /save-current-prices - uses the [scraper service](#scraper) to collect data  
- Note: AgentQL should recognize any url with a list of cryptocurrency prices
- optional JSON `url` key and string value (default [crypto.com/price](https://crypto.com/price))
```
{
  "url": "https://crypto.com/price"
}
```

3. /save-historical-price - uses the [coinmarketcap service](#coinmarketcap) to collect data  
- expects JSON `symbol` key string value
```
{
  "symbol": "BTC"
}
```