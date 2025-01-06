import { IThread, ChatCompletionMessage } from '../interfaces/interfaces';
import { validateInput } from './validateInput';
import { updateThreadWithUserMessage } from './updateThreads';
import { getAssistantResponse } from './chatAssistant';
import { clearInput } from './clearInput';

export const handleForm = async (
  e: React.FormEvent,
  input: string,
  currentThreadId: string,
  threads: IThread[],
  setThreads: React.Dispatch<React.SetStateAction<IThread[]>>,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  onNewThread: (initialMessage: string) => void
) => {
  e.preventDefault();

  // Validar la entrada antes de proceder
  if (!validateInput(input)) {
    return;
  }

  const userMessage: ChatCompletionMessage = { role: 'user', content: input };

  // Si no hay un hilo actual, crea uno nuevo
  if (!currentThreadId) {
    onNewThread(input);
  } else {
    // Si ya hay un hilo, agrega el mensaje al hilo actual
    updateThreadWithUserMessage(currentThreadId, threads, userMessage, setThreads);

    // Consultar al asistente usando la función externa
    getAssistantResponse(currentThreadId, threads, userMessage, setThreads);
  }

  // Limpiar el campo de entrada
  clearInput(setInput);
};
