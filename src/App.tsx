import { useState, useEffect } from 'react';
import { IThread } from './interfaces/interfaces';
import { Threads } from './components/threads';
import { Conversations } from './components/conversations';
import { SendMessage } from './components/sendMessage';
import { handleForm } from './utils/handleForm'; 
import { handleChange } from './utils/handleChange'; 
import { infoCompany } from './utils/info';
import { fetchUserData, createNewThread } from './utils/firestore';
import { handleLogOut } from './utils/auth';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';
import { greeting } from './utils/greeting';

import './App.css';
import { unsubscribe } from './utils/unsuscribe';

function App() {
  const [threads, setThreads] = useState<IThread[]>([]); 
  const [currentThreadId, setCurrentThreadId] = useState<string>(''); 
  const [input, setInput] = useState<string>(''); 
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData(setUserName, setThreads);
  }, []);
  

  useEffect(() => {
    const unsubscribeHandler = unsubscribe(auth, setUserName, setThreads); // Usar la función
    return () => unsubscribeHandler(); // Limpiar al desmontar
  }, []);
  

  const onNewThread = async (initialMessage: string): Promise<string> => {
    const newThread: IThread = {
      id: crypto.randomUUID(),
      title: `Hilo: ${initialMessage}`,
      messages: [
        {
          role: "system",
          content: `Eres un asistente virtual de Virtual Mentor. Responde a todo lo que te pregunten, si te preguntan sobre Virtual Mentor coge la información de la empresa: ${infoCompany}`,
        },
        { role: "user", content: initialMessage },
      ],
    };
  
    return await createNewThread(newThread, setThreads, setCurrentThreadId);
  };
  
  const onThreadSelect = (threadId: string) => {
    setCurrentThreadId(threadId);
  };

  const handleThreadsUpdate = (updatedThreads: IThread[]) => {
    setThreads(updatedThreads);
  };

  return (
    <>
      <h1>{greeting(new Date().getHours())} {userName} soy tu Asistente Virtual Mentor</h1>
      <Threads   
        threads={threads} 
        currentThreadId={currentThreadId} 
        onThreadSelect={onThreadSelect} 
        onNewThread={onNewThread} 
        setThreads={setThreads} 
        onThreadsUpdate={handleThreadsUpdate}
      />
      <Conversations currentThreadId={currentThreadId} threads={threads} userName={userName} />
      <SendMessage
        input={input}
        handleForm={(e) => handleForm(e, input, currentThreadId, threads, setThreads, setInput, onNewThread)} 
        handleChange={(e) => handleChange(e, setInput)} 
      />
      <button onClick={() => handleLogOut(navigate)}>Cerrar Sesión</button>
    </>
  );
}

export default App;
