import { IThread } from '../interfaces/interfaces';
import { createNewThread } from './firestore';
import { Dispatch, SetStateAction } from 'react';

const loadJSON = async () => {
    const response = await fetch('/fragments.json');
    const data = await response.json();
    return data; 
}

export const onNewThread = async (
  initialMessage: string,
  setThreads: Dispatch<SetStateAction<IThread[]>>,
  setCurrentThreadId: Dispatch<SetStateAction<string>>
): Promise<string> => {

  const jsonData = await loadJSON();
  const jsonDataString = JSON.stringify(jsonData, null, 2);

  const newThread: IThread = {
    id: crypto.randomUUID(),
    title: initialMessage,
    messages: [
      {
        role: 'system',
        content: `Eres un asistente virtual de Virtual Mentor conocedor de la banda the shooters usa la información de: ${jsonDataString}.`,
      },
      { role: 'user', content: initialMessage },
    ],
  };

  return await createNewThread(newThread, setThreads, setCurrentThreadId);
};
