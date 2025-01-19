import { IThread } from '../interfaces/interfaces';
import { createNewThread } from './firestore';
import { Dispatch, SetStateAction } from 'react';
import { infoCompany } from './info';

export const onNewThread = async (
  initialMessage: string,
  setThreads: Dispatch<SetStateAction<IThread[]>>,
  setCurrentThreadId: Dispatch<SetStateAction<string>>
): Promise<string> => {
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

  return await createNewThread(newThread, setThreads, setCurrentThreadId);
};
