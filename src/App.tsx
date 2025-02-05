import { useState, useEffect } from 'react';
import { IThread } from './interfaces/interfaces';
import { Threads } from './components/threads';
import { Conversations } from './components/conversations';
import { SendMessage } from './components/sendMessage';
import { handleForm } from './utils/handleForm'; 
import { handleChange } from './utils/handleChange'; 
import { fetchUserData } from './utils/firestore';
import { auth } from './firebase/firebaseConfig';
import { unsubscribe } from './utils/unsuscribe';
import { onNewThread } from './utils/onNewThread';
import { Header } from './components/header';

import './css/app.css';

function App() {
  const [threads, setThreads] = useState<IThread[]>([]); 
  const [currentThreadId, setCurrentThreadId] = useState<string>(''); 
  const [input, setInput] = useState<string>(''); 
  const [userName, setUserName] = useState<string | null>(null);


  useEffect(() => {
    fetchUserData(setUserName, setThreads);
  }, []);


  useEffect(() => {
    const unsubscribeHandler = unsubscribe(auth, setUserName, setThreads);
    return () => unsubscribeHandler();
  }, []);


  const onThreadSelect = (threadId: string) => {
    setCurrentThreadId(threadId);
  };


  const handleThreadsUpdate = (updatedThreads: IThread[]) => {
    setThreads(updatedThreads);
  };

  const handleNewThread = (initialMessage: string) => {
    return onNewThread(initialMessage, setThreads, setCurrentThreadId);
  };

  return (
    <>
      <Header userName={userName}/>

      <div className='content'>
        <Threads   
          threads={threads} 
          currentThreadId={currentThreadId} 
          onThreadSelect={onThreadSelect}
          onNewThread={(initialMessage) => onNewThread(initialMessage, setThreads, setCurrentThreadId)}
          setThreads={setThreads} 
          onThreadsUpdate={handleThreadsUpdate}
        />
      <div className='container-conversation'>
        <div className='container-conversation__content'>
          <Conversations currentThreadId={currentThreadId} threads={threads} userName={userName} />

          <SendMessage
            input={input}
            handleForm={handleForm}
            handleChange={(e) => handleChange(e, setInput)}
            currentThreadId={currentThreadId}
            threads={threads}
            setThreads={setThreads}
            setInput={setInput}
            onNewThread={handleNewThread}  
          />
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
