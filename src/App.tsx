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

import './App.css';

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
    console.log('Estado actual de threads:', threads);
  }, [threads]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || 'Usuario');
        try {
          await fetchUserData(setUserName, setThreads); // Llama a la función sin necesidad de setUserName si no lo necesitas
        } catch (error) {
          console.error('Error al cargar los datos del usuario:', error);
        }
      } else {
        console.log("No hay usuario autenticado.");
        setUserName(null);
        setThreads([]);
      }
    });
  
    return () => unsubscribe(); // Limpia el listener al desmontar
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

  return (
    <>
      <h1>Hola {userName} soy tu Asistente Virtual Mentor</h1>
      <Threads threads={threads} currentThreadId={currentThreadId} onThreadSelect={onThreadSelect} onNewThread={onNewThread} />
      <Conversations currentThreadId={currentThreadId} threads={threads} />
      <SendMessage
        input={input}
        handleForm={(e) => handleForm(e, input, currentThreadId, threads, setThreads, setInput, onNewThread)} // Llamamos a handleForm
        handleChange={(e) => handleChange(e, setInput)} 
      />
      <button onClick={() => handleLogOut(navigate)}>Cerrar Sesión</button>
    </>
  );
}

export default App;
