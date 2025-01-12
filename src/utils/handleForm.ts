import { IThread, ChatCompletionMessage } from '../interfaces/interfaces';
import { validateInput } from './validateInput';
import { updateThreadWithUserMessage } from './updateThreads';
import { getAssistantResponse } from './chatAssistant';
import { clearInput } from './clearInput';
import { saveMessageToFirestore } from './firestore';

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

  // Validar entrada
  if (!validateInput(input)) {
    return;
  }

  const userMessage: ChatCompletionMessage = { role: 'user', content: input };

  if (!currentThreadId) {
    onNewThread(input);
  } else {
    // Actualizar estado local
    updateThreadWithUserMessage(currentThreadId, userMessage, setThreads);



    console.log('Guardando mensaje del usuario en Firestore:', {
      threadId: currentThreadId,
      role: 'user',
      content: input,
    });
    await saveMessageToFirestore(currentThreadId, 'user', input);
    
    // Obtener respuesta del asistente
    const assistantResponse = await getAssistantResponse(
      currentThreadId,
      threads,
      { role: 'user', content: input },
      setThreads
    );
    
    // Guardar la respuesta del asistente en Firestore
    if (assistantResponse) {
      console.log('Guardando respuesta del asistente en Firestore:', {
        threadId: currentThreadId,
        role: 'assistant',
        content: assistantResponse.content,
      });
      await saveMessageToFirestore(
        currentThreadId,
        'assistant',
        assistantResponse.content
      );
    }
  }

  // Limpiar el campo de entrada
  clearInput(setInput);
};
