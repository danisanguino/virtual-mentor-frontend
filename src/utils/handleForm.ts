import { IThread, ChatCompletionMessage } from '../interfaces/interfaces';
import { validateInput } from './validateInput';
import { updateThreadWithUserMessage } from './updateThreads';
import { getAssistantResponse } from './chatAssistant';
import { clearInput } from './clearInput';
import { saveMessageToThread } from './firestore'; 

export const handleForm = async (
  e: React.FormEvent,
  input: string,
  currentThreadId: string,
  threads: IThread[],
  setThreads: React.Dispatch<React.SetStateAction<IThread[]>>,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  onNewThread: (initialMessage: string) => Promise<string> 
) => {
  e.preventDefault();

  if (!validateInput(input)) {
    return;
  }

  const userMessage: ChatCompletionMessage = { role: "user", content: input };

  let threadId = currentThreadId;

  if (!threadId) {
    try {
      threadId = await onNewThread(input);
    } catch (error) {
      alert("Hubo un problema al crear el hilo. Intenta nuevamente.");
      return;
    }
  }

  try {
    updateThreadWithUserMessage(threadId, userMessage, setThreads);
    await saveMessageToThread(threadId, "user", input);


    const assistantResponse = await getAssistantResponse(
      threadId,
      threads,
      userMessage,
      setThreads
    );

    if (assistantResponse) {
      try {
        // Guardar respuesta del asistente en Firestore
        await saveMessageToThread(threadId, "assistant", assistantResponse.content);
      } catch (error) {
        console.error("Error al guardar la respuesta del asistente:", error);
        alert("Hubo un problema al guardar la respuesta del asistente.");
      }
    }
  } catch (error) {
    console.error("Error en el manejo del formulario:", error);
    alert("Ocurrió un problema al procesar tu mensaje. Intenta nuevamente.");
  }

  clearInput(setInput);
};

