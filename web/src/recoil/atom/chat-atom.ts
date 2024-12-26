import { AssistantModel } from "@/models/assistants";
import { MessageModel } from "@/models/messages";
import { ThreadModel } from "@/models/threads";
import { atom } from "recoil";

export const chatDetailsState = atom({
  key: "chatDetailsState",
  default: {
    threadId: 1,
    assistantId: 1,
  },
});

export const assistantListState = atom<AssistantModel[]>({
  key: "assistantListState",
  default: [],
});

export const threadListState = atom<ThreadModel[]>({
  key: "threadListState",
  default: [],
});

export const messageListState = atom<MessageModel[]>({
  key: "messageListState",
  default: [],
});
