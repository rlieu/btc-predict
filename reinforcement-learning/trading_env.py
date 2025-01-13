import numpy as np
from gym import Env
from gym.spaces import Discrete, Box

class TradingEnvironment(Env):
    def __init__(self, data):
        super(TradingEnvironment, self).__init__()
        
        self.data = data
        self.n_steps = len(data)
        
        # Actions: 0 = hold, 1 = buy, 2 = sell
        self.action_space = Discrete(3)
        
        n_features = self.data.shape[1] - 1  # Exclude timestamp column
        self.observation_space = Box(low=-np.inf, high=np.inf, shape=(n_features,), dtype=np.float32)
        
        self.current_step = 0
        self.cash = 10000
        self.holdings = 0
        self.net_worth = self.cash
        
    def reset(self):
        self.current_step = 0
        self.cash = 10000
        self.holdings = 0
        self.net_worth = self.cash
        return self._get_observation()
    
    def _get_observation(self):
        obs = self.data.iloc[self.current_step].drop(['timestamp']).values
        return np.nan_to_num(obs).astype(np.float32)
    
    def step(self, action):
        # Execute action and calculate reward
        current_price = self.data.iloc[self.current_step]['price']
        
        if action == 1:  # Buy
            self.holdings += self.cash / current_price
            self.cash = 0
        elif action == 2:  # Sell
            self.cash += self.holdings * current_price
            self.holdings = 0
        
        self.net_worth = self.cash + (self.holdings * current_price)
        self.current_step += 1
        
        reward = self.net_worth - (self.cash + (self.holdings * current_price))
        
        done = self.current_step >= (self.n_steps - 1)
        
        obs = self._get_observation() if not done else None
        
        return obs, reward, done, {}
    
    def render(self):
        print(f"Step: {self.current_step}, Cash: {self.cash}, Holdings: {self.holdings}, Net Worth: {self.net_worth}")