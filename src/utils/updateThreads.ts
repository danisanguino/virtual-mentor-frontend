import { IThread, ChatCompletionMessage } from '../interfaces/interfaces';

// Función para agregar el mensaje del usuario al hilo
export const updateThreadWithUserMessage = (
  currentThreadId: string,
  threads: IThread[],
  userMessage: ChatCompletionMessage,
  setThreads: React.Dispatch<React.SetStateAction<IThread[]>>
) => {
  setThreads((prevThreads) =>
    prevThreads.map((thread) =>
      thread.id === currentThreadId
        ? { ...thread, messages: [...thread.messages, userMessage] }
        : thread
    )
  );
};
