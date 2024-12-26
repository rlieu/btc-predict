import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { chatDetailsState, messageListState, threadListState } from '@/recoil/atom/chat-atom';
import SearchInput from '@/components/ui/search-input';
import { MessageModel } from '@/models/messages';

export const ChatBar = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [threadList, setThreadList] = useRecoilState(threadListState);
  const [chatDetails, setChatDetails] = useRecoilState(chatDetailsState);
  const setMessageList = useSetRecoilState(messageListState);
  const { threadId: selectedThreadId } = chatDetails;

  useEffect(() => {
    getThreads();
  }, [setThreadList]);

  useEffect(() => {
    if (threadList.length > 0) {
      setSelectedThread(threadList[0].id);
    }
  }, [threadList]);

  useEffect(() => {
    const selectedThread = threadList.find(thread => thread.id == selectedThreadId);
    setMessageList(selectedThread?.['Messages'] as MessageModel[]);
  }, [selectedThreadId]);

  const getThreads = async () => {
    // TODO make userId dynamic
    const threadsRes = await fetch("/api/openai/threads?userId=1");
    const threads = await threadsRes.json();

    if (threads.length > 0) {
      setThreadList(threads);
    }
  };

  const setSelectedThread = (threadId: number) => {
    setChatDetails({
      ...chatDetails,
      threadId
    });
  };

  const searchThreads = (e: ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    setSearchText(inputText);

    // if (inputText) {
    //   const filteredThreads = threadList.filter(thread => thread.thread_name.includes(inputText));
    //   setThreadList(filteredThreads);
    // }
  };

  return (
    <div className="chat__sidebar">
      <SearchInput
        value={searchText}
        onChange={searchThreads}
      />

      <div>
        <h4 className="chat__header">THREADS</h4>
        <div className="chat__threads">
          {threadList.map(thread => (
            <p key={thread.id} className={thread.id == selectedThreadId ? "thread__active" : "thread"} onClick={() => setSelectedThread(thread.id)}>
              {thread.thread_name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
