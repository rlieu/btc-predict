'use client';

import React, { useState } from 'react';
import { ChatBar } from '@/components/chat/chat-bar';
import { ChatBody } from '@/components/chat/chat-body';
import { ChatInput } from '@/components/chat/chat-input';

const ChatPage = () => {

  return (
    <div className="chat">
      <ChatBar />
      <div className="chat__main">
        <ChatBody />
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;
