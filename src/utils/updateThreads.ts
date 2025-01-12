import { IThread, ChatCompletionMessage } from '../interfaces/interfaces';

// Función para agregar el mensaje del usuario al hilo
export const updateThreadWithUserMessage = (
  threadId: string,
  message: ChatCompletionMessage,
  setThreads: React.Dispatch<React.SetStateAction<IThread[]>>
) => {
  console.log('Actualizando el hilo en el estado local:', { threadId, message });

  setThreads((prevThreads) =>
    prevThreads.map((thread) =>
      thread.id === threadId
        ? { ...thread, messages: [...thread.messages, message] }
        : thread
    )
  );
};

