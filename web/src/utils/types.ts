import { Message } from "openai/resources/beta/threads/messages";

export interface UserInput {
  userId?: number;
  username?: string;
}

export interface AssistantInput {
  openai_id?: string;
  assistantId?: number;
  assistantName?: string;
}

export interface ThreadInput {
  openai_id?: string;
  threadId?: number;
  userId?: number;
}

export interface MessageInput {
  messageId?: number;
  assistantId?: number;
  threadId?: number;
  userId?: number;
  userInput?: string;
}

export interface RunInput {
  runId?: number;
  assistantId?: number;
  threadId?: number;
  userId?: number;
  userInput?: string;
}

export interface ChatMessage extends Message {
  text: string;
}
