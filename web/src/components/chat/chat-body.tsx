import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { assistantListState, chatDetailsState, messageListState, threadListState } from '@/recoil/atom/chat-atom';
import SelectInput from '@/components/ui/select-input';
import { FaRegPlusSquare } from "react-icons/fa";
import { MessageModel } from '@/models/messages';

export const ChatBody = () => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [assistantList, setAssistantList] = useRecoilState(assistantListState);
  const [messageList, setMessageList] = useRecoilState(messageListState);
  const [threadList, setThreadList] = useRecoilState(threadListState);
  // const [selectedAssistant, setSelectedAssistant] = useState<string>('');
  const [chatDetails, setChatDetails] = useRecoilState(chatDetailsState);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    getAssistants();
  }, [setAssistantList]);

  const getAssistants = async () => {
    const assistantsRes = await fetch("/api/openai/assistants");
    const assistants = await assistantsRes.json();

    if (assistants.length > 0) {
      setAssistantList(assistants);
      // setSelectedAssistant(assistants[0].assistant_name);
    }
  };

  // useEffect(() => {
  //   getMessages();
  // }, [setMessageList]);

  // const getMessages = async () => {
  //   // TODO make threadId dynamic
  //   const messages = await fetch("/api/openai/messages?threadId=1");

  //   setMessageList(await messages.json());
  // };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedAssistantId = event.target.value;

    const assistant = (assistantList).find((option) => option.id == Number(selectedAssistantId));
    console.log({ assistant, assistantList, selectedAssistantId });
    setChatDetails({
      ...chatDetails,
      assistantId: assistant?.id as number
    });
  };

  const newThread = async () => {
    const threadRes = await fetch('/api/openai/threads', {
      method: 'POST',
      body: JSON.stringify({ userId: 1 }), // todo make userId dynamic
    });
    const thread = await threadRes.json();

    // setChatDetails({
    //   ...chatDetails,
    //   threadId: thread.id
    // });

    // TODO render threads using context?
    thread['Messages'] = [];
    setThreadList([thread, ...threadList]);
  };

  return (
    <>
      <header className="chat__mainHeader">
        <SelectInput
          options={assistantList}
          // value={selectedAssistant}
          onChange={handleSelectChange}
        />
        <FaRegPlusSquare className="chat__create" size={28} onClick={newThread} />
      </header>

      <div className="message__container">
        {messageList?.map((message: MessageModel) => (
          <div className="message__chats" key={message.id}>
            <p className={message.role === 'user' ? "sender__name" : ""}>{new Date(message.createdAt).toLocaleTimeString()}</p>
            <div className={message.role === 'user' ? "message__sender" : "message__recipient"}>
              <p>{message.content}</p>
            </div>
          </div>
        ))}

        <div className="message__status">
          {/* <p>Generating response...</p> */}
        </div>
        <div ref={chatEndRef} />
      </div>
    </>
  );
};
