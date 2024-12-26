import React, { FormEvent, useState } from 'react';
import { useRecoilState, useSetRecoilState } from "recoil";
import { chatDetailsState, messageListState } from "@/recoil/atom/chat-atom";
import { FaMicrophone } from "react-icons/fa";

export const ChatInput = () => {
  const [message, setMessage] = useState('');
  const setMessageList = useSetRecoilState(messageListState);
  const [{ assistantId, threadId }] = useRecoilState(chatDetailsState);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    if (message) {
      const newMsg = {
        userInput: message.trim(),
        assistantId,
        threadId, // TODO make dynamic
        userId: 1 // TODO use selector  
      };
      console.log({ newMsg, threadId, assistantId });
      setMessage('');

      const messages = await fetch('/api/openai/messages', {
        method: 'POST',
        body: JSON.stringify(newMsg),
      });

      setMessageList(await messages.json());
    }
  };

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message__input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <FaMicrophone className="microphone" size={28} />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};
