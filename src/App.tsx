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

// import './css/app.css';

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

  return (
    <>
      <Header userName={userName} />

      <Threads   
        threads={threads} 
        currentThreadId={currentThreadId} 
        onThreadSelect={onThreadSelect}
        onNewThread={(initialMessage) => onNewThread(initialMessage, setThreads, setCurrentThreadId)}
        setThreads={setThreads} 
        onThreadsUpdate={handleThreadsUpdate}
      />

      <Conversations currentThreadId={currentThreadId} threads={threads} userName={userName} />

      <SendMessage
        input={input}
        handleForm={(e) => handleForm(e, input, currentThreadId, threads, setThreads, setInput, (initialMessage) =>
          onNewThread(initialMessage, setThreads, setCurrentThreadId)
        )}
        handleChange={(e) => handleChange(e, setInput)} 
      />

    </>
  );
}

export default App;