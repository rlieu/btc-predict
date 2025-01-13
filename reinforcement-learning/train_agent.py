import numpy as np
import pandas as pd
from trading_env import TradingEnvironment
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint
import random
from collections import deque
import matplotlib.pyplot as plt
import joblib

def plot_net_worth(all_net_worths):
    for episode, net_worths in enumerate(all_net_worths):
        plt.plot(net_worths, label=f'Episode {episode+1}')
    plt.xlabel('Time Step')
    plt.ylabel('Net Worth')
    plt.title('Net Worth Over Time')
    plt.legend()
    plt.show()

def plot_actions(actions, net_worths):
    buy_steps = [i for i, a in enumerate(actions) if a == 1]
    sell_steps = [i for i, a in enumerate(actions) if a == 2]
    hold_steps = [i for i, a in enumerate(actions) if a == 0]

    plt.plot(net_worths, label='Net Worth', color='blue')
    plt.scatter(buy_steps, [net_worths[i] for i in buy_steps], color='green', label='Buy', marker='^')
    plt.scatter(sell_steps, [net_worths[i] for i in sell_steps], color='red', label='Sell', marker='v')
    plt.xlabel('Time Step')
    plt.ylabel('Net Worth')
    plt.title('Actions Taken by Agent')
    plt.legend()
    plt.show()

# Deep Q-Learning model
class DQNAgent:
    def __init__(self, state_size, action_size):
        self.state_size = state_size
        self.action_size = action_size
        self.memory = deque(maxlen=2000)
        self.gamma = 0.95    # discount rate
        self.epsilon = 1.0  # exploration rate
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995
        self.learning_rate = 0.001
        self.model = self._build_model()
        self.checkpoint = ModelCheckpoint(
            filepath='best_dqn_model.keras',
            save_best_only=True,
            monitor='loss',
            mode='min',
            verbose=1
        )

    def _build_model(self):
        model = Sequential()
        model.add(Input(shape=(self.state_size,)))
        model.add(Dense(24, activation='relu'))
        model.add(Dense(24, activation='relu'))
        model.add(Dense(self.action_size, activation='linear'))
        model.compile(loss='mse', optimizer=Adam(learning_rate=self.learning_rate))
        return model

    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))

    def act(self, state):
        if np.random.rand() <= self.epsilon:
            return random.randrange(self.action_size)
        act_values = self.model.predict(state, verbose=0)
        return np.argmax(act_values[0])  # returns action

    def replay(self, batch_size):
        minibatch = random.sample(self.memory, batch_size)
        for state, action, reward, next_state, done in minibatch:
            # print("State:", state, "Next State:", next_state)
            target = reward
            if not done:
                target = (reward + self.gamma * 
                          np.amax(self.model.predict(next_state, verbose=0)[0]))
            target_f = self.model.predict(state, verbose=0)
            target_f[0][action] = target
            self.model.fit(state, target_f, epochs=1, verbose=0, callbacks=[self.checkpoint])
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay

def train_agent(data, episodes=1000, batch_size=32):
    data = data.dropna(subset=['price']).reset_index(drop=True)
    env = TradingEnvironment(data)

    # Initialize DQN Agent
    state_size = env.observation_space.shape[0]
    action_size = env.action_space.n
    agent = DQNAgent(state_size, action_size)

    all_net_worths = []
    all_actions = []

    for e in range(episodes):
        state = env.reset()
        state = np.reshape(state, [1, state_size])

        net_worths = []
        actions = []
        for time in range(500):
            action = agent.act(state)
            next_state, reward, done, _ = env.step(action)
            reward = reward if not done else -10

            net_worths.append(env.net_worth)
            actions.append(action)

            next_state = np.reshape(next_state, [1, state_size]) if next_state is not None else None
            agent.remember(state, action, reward, next_state, done)
            state = next_state
            if done:
                print(f"Episode: {e}/{episodes}, Score: {env.net_worth}")
                all_net_worths.append(net_worths)
                all_actions.append(actions)
                break
            if len(agent.memory) > batch_size:
                agent.replay(batch_size)

        if e % 10 == 0:
            checkpoint_path = f"dqn_trading_model_episode_{e}.keras"
            agent.model.save(checkpoint_path)
            joblib.dump({'memory': agent.memory, 'epsilon': agent.epsilon}, f'agent_training_state_episode_{e}.joblib')
            print(f"Checkpoint saved at episode {e}: {checkpoint_path}")

    plot_net_worth(all_net_worths)
    plot_actions(all_actions[-1], all_net_worths[-1])