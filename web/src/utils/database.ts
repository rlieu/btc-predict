import { User, Assistant, Thread, Message, Run } from '@/models';
import { AssistantInput, MessageInput, ThreadInput, UserInput } from './types';
import { UserModel } from '@/models/users';
import { AssistantModel } from '@/models/assistants';
import { ThreadModel } from '@/models/threads';

export const createUser = async ({ username }: UserInput) => {
  let error;
  let user;

  try {
    user = await User.create({ username: username as string });
  } catch (e) {
    error = `Error creating user: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, user };
};

export const getUsers = async () => {
  let error;
  let users;

  try {
    users = await User.findAll();
  } catch (e) {
    error = `Error fetching users: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, users };
};

export const getUserById = async ({ userId }: UserInput) => {
  let error;
  let user;

  try {
    user = await User.findByPk(userId, {
      include: Thread
    });
  } catch (e) {
    error = `Error fetching user: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, user };
};

export const updateUser = async ({ userId, username }: UserInput) => {
  let error;
  let user;

  try {
    user = await User.findByPk(userId) as UserModel;
    user.username = username as string;
    await user?.save();
  } catch (e) {
    error = `Error updating user: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, user };
};

export const deleteUser = async ({ userId }: UserInput) => {
  let error;
  let success = false;

  try {
    const user = await User.findByPk(userId);
    await user?.destroy();
    success = true;
  } catch (e) {
    error = `Error deleting user: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, success };
};

export const getMessagesByThread = async ({ threadId }: MessageInput) => {
  let error;
  let messages;

  try {
    messages = await Message.findAll({
      order: [['createdAt', 'ASC']],
      where: {
        thread_id: threadId
      }
    });
  } catch (e) {
    error = `Error fetching messages: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, messages };
};

export const createAssistant = async ({ openai_id, assistantName }: AssistantInput) => {
  let error;
  let assistant;

  try {
    assistant = await Assistant.create({
      assistant_name: assistantName as string,
      openai_id: openai_id as string
    });
  } catch (e) {
    error = `Error creating assistant: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, assistant };
};

export const getAssistants = async () => {
  let error;
  let assistants;

  try {
    assistants = await Assistant.findAll();
  } catch (e) {
    error = `Error fetching assistants: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, assistants };
};

export const getAssistantById = async ({ assistantId }: AssistantInput) => {
  let error;
  let assistant;

  try {
    assistant = await Assistant.findByPk(assistantId);
  } catch (e) {
    error = `Error fetching assistant: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, assistant };
};

export const updateAssistant = async ({ assistantId, assistantName, openai_id }: AssistantInput) => {
  let error;
  let assistant;

  try {
    assistant = await Assistant.findByPk(assistantId) as AssistantModel;
    assistant.assistant_name = assistantName as string;
    assistant.openai_id = openai_id as string;
    await assistant?.save();
  } catch (e) {
    error = `Error updating assistant: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, assistant };
};

export const deleteAssistant = async ({ assistantId }: AssistantInput) => {
  let error;
  let success = false;
  try {
    const assistant = await Assistant.findByPk(assistantId);
    await assistant?.destroy();
    success = true;
  } catch (e) {
    error = `Error deleting assistant: ${JSON.stringify(e)}`;
    throw e;
  }
  return { error, success };
};

// Get all threads for a specific user
export const getThreadsByUser = async ({ userId }: ThreadInput) => {
  let error;
  let threads;

  try {
    threads = await Thread.findAll({
      order: [['createdAt', 'DESC']],
      where: { user_id: userId },
      include: [Message]
    });
  } catch (e) {
    error = `Error fetching assistant: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, threads };
};

// Get a specific thread by ID for a specific user
export const getUserThreadById = async ({ userId, threadId }: ThreadInput) => {
  let error;
  let thread;

  try {
    thread = await Thread.findOne({ where: { id: threadId, user_id: userId }, include: [Message, Run] });
  } catch (e) {
    error = `Error fetching thread: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, thread };
};

// Update a specific thread by ID for a specific user
export const updateUserThread = async ({ userId, threadId, openai_id }: ThreadInput) => {
  let error;
  let thread;

  try {
    thread = await Thread.findOne({ where: { id: threadId, user_id: userId } }) as ThreadModel;
    thread.openai_id = openai_id as string;
    await thread?.save();
  } catch (e) {
    error = `Error updating thread: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, thread };
};

// Delete a specific thread by ID for a specific user
export const deleteThread = async ({ userId, threadId }: ThreadInput) => {
  let error;
  let success = false;
  try {
    const thread = await Thread.findOne({ where: { id: threadId, user_id: userId } });
    await thread?.destroy();
    success = true;
  } catch (e) {
    error = `Error deleting thread: ${JSON.stringify(e)}`;
    throw e;
  }
  return { error, success };
};
