import OpenAI from 'openai';
import { IThread, ChatCompletionMessage } from '../interfaces/interfaces';


const API_KEY: string | undefined = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});


export const getAssistantResponse = async (
  currentThreadId: string,
  threads: IThread[],
  userMessage: ChatCompletionMessage,
  setThreads: React.Dispatch<React.SetStateAction<IThread[]>>
): Promise<ChatCompletionMessage | null> => { 
  try {
    const currentThread = threads.find((t) => t.id === currentThreadId);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: currentThread ? [...currentThread.messages, userMessage] : [userMessage],
    });

    const assistantMessage = response.choices[0]?.message?.content;

    if (assistantMessage) {
      const assistantResponse: ChatCompletionMessage = {
        role: 'assistant',
        content: assistantMessage,
      };

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

      return assistantResponse; 
    }

    return null;
  } catch (error) {
    console.error('Error al consultar al asistente:', error);
    return null; 
  }
};
