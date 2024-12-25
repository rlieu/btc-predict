# BTC Price Forecasting

### The following is performed in [coinmarketcap.ipynb](./notebooks/coinmarketcap.ipynb)

1. Fetch BTC price history using the CoinMarketCap API  
2. Save data to [CSV](./quotes.csv)  
3. Predict the future price of BTC using the Autoregressive Moving Average (ARMA) Model  
4. Plot the results

### The following is performed in [training_tensorflow.ipynb](./notebooks/training_tensorflow.ipynb)

1. Create DataFrame using CSV  
2. Create sequences of timeseries windows for historical BTC prices  
3. Split data into train / test sets  
4. Tune hyperparameters  
5. Build and train LSTM model  
6. Plot the results

### The following is performed in [training_pytorch.ipynb](./notebooks/training_pytorch.ipynb)

1. Create DataFrame using CSV  
2. Create sequences of timeseries windows for historical BTC prices  
3. Split data into train / test sets  
4. Tune hyperparameters (TODO)  
5. Build and train LSTM model  
6. Plot the results