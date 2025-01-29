import OpenAI from 'openai';
import { IThread, ChatCompletionMessage } from '../interfaces/interfaces';

// Crear una instancia de OpenAI
const API_KEY: string | undefined = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

// Función para obtener la respuesta del asistente
export const getAssistantResponse = async (
  currentThreadId: string,
  threads: IThread[],
  userMessage: ChatCompletionMessage,
  setThreads: React.Dispatch<React.SetStateAction<IThread[]>>
): Promise<ChatCompletionMessage | null> => { 
  try {
    // Encontrar el hilo actual
    const currentThread = threads.find((t) => t.id === currentThreadId);
    
    // Si el hilo existe, enviar el mensaje
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: currentThread ? [...currentThread.messages, userMessage] : [userMessage],
    });

    // Obtener el mensaje del asistente
    const assistantMessage = response.choices[0]?.message?.content;

    if (assistantMessage) {
      const assistantResponse: ChatCompletionMessage = {
        role: 'assistant',
        content: assistantMessage,
      };

      // Actualizar el estado de los hilos con la respuesta del asistente
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === currentThreadId
            ? {
                ...thread,
                messages: [...thread.messages, assistantResponse],
              }
            : thread
        )
      );

      // Retornar la respuesta del asistente
      return assistantResponse; // Se devuelve el mensaje del asistente
    }

    // Si no hay respuesta del asistente, se devuelve null
    return null;
  } catch (error) {
    console.error('Error al consultar al asistente:', error);
    return null; // Devolver null en caso de error
  }
};
