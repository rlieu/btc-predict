import tensorflow as tf

def model_forecast(model, series, window_size=5):
    ds = tf.data.Dataset.from_tensor_slices(series)
    ds = ds.window(window_size, shift=1, drop_remainder=True)
    ds = ds.flat_map(lambda w: w.batch(window_size))
    ds = ds.batch(32).prefetch(1)
    forecast = model.predict(ds)
    return forecast[:,0]

def process_historical_price(data_df):
    # Calculate moving averages for price (7-day, 30-day)
    data_df['price_ma_7d'] = data_df['price'].rolling(window=7).mean()
    data_df['price_ma_30d'] = data_df['price'].rolling(window=30).mean()

    # Compute rolling standard deviations for percentage changes
    data_df['volatility_1h'] = data_df['percent_change_1h'].rolling(window=7).std()
    data_df['volatility_24h'] = data_df['percent_change_24h'].rolling(window=7).std()
    data_df['volatility_7d'] = data_df['percent_change_7d'].rolling(window=7).std()

    # Price-to-volume ratio
    data_df['price_to_volume'] = data_df['price'] / data_df['volume_24h']

    # Momentum features
    data_df['momentum_1h'] = data_df['percent_change_1h'].diff()
    data_df['momentum_24h'] = data_df['percent_change_24h'].diff()
    data_df['momentum_7d'] = data_df['percent_change_7d'].diff()

    data_df = data_df.drop(columns=['Unnamed: 0']).dropna()

    return data_df