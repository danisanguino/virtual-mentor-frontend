import { useState, useEffect } from 'react';
import { IThread, ChatCompletionMessage } from './interfaces/interfaces';
import { signOut } from 'firebase/auth'; 
import { Threads } from './components/threads';
import { Conversations } from './components/conversations';
import { SendMessage } from './components/sendMessage';
import { handleForm } from './utils/handleForm'; 
import { handleChange } from './utils/handleChange'; 
import { infoCompany } from './utils/info';
import { getDocs, collection } from "firebase/firestore";
import { db, auth } from './firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

import './App.css';

function App() {

  const [threads, setThreads] = useState<IThread[]>([]); 
  const [currentThreadId, setCurrentThreadId] = useState<string>(''); 
  const [input, setInput] = useState<string>(''); 
  const navigate = useNavigate();


  useEffect(() => {
    const testFirestoreConnection = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "testCollection"));
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
        });
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    testFirestoreConnection();
  }, []);

 
  const onNewThread = (initialMessage: string) => {
    const newThread: IThread = {
      id: crypto.randomUUID(),
      title: `Hilo: ${initialMessage}`,
      messages: [
        {
          role: 'system',
          content: `Eres un asistente virtual de Virtual Mentor. Responde a todo lo que te pregunten, si te preguntan sobre Virtual Mentor coge la información de la empresa: ${infoCompany}`,
        },
        { role: 'user', content: initialMessage },
      ],
    };

    setThreads((prev) => [...prev, newThread]); 
    setCurrentThreadId(newThread.id); 
  };

  
  const onThreadSelect = (threadId: string) => {
    setCurrentThreadId(threadId);
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth); 
      navigate("/"); 
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <>
      <h1>Asistente Virtual Mentor</h1>
      <Threads threads={threads} currentThreadId={currentThreadId} onThreadSelect={onThreadSelect} onNewThread={onNewThread} />
      <Conversations currentThreadId={currentThreadId} threads={threads} />
      <SendMessage
        input={input}
        handleForm={(e) => handleForm(e, input, currentThreadId, threads, setThreads, setInput, onNewThread)} 
        handleChange={(e) => handleChange(e, setInput)} 
      />
      <button onClick={handleLogOut}>Cerrar Sesión</button>
    </>
  );
}

export default App;
