import { NewThreadParams } from '../interfaces/functionsIntefaces';
import { IThread } from '../interfaces/interfaces';


export const onNewThread = ({ initialMessage, setThreads, setCurrentThreadId }: NewThreadParams) => {
  // Crear un nuevo hilo
  const newThread: IThread = {
    id: crypto.randomUUID(), // Generar un id único para el hilo
    title: `Hilo: ${initialMessage}`, // Usar el mensaje inicial como título del hilo
    messages: [
      {
        role: 'system',
        content: `Eres un asistente virtual de Virtual Mentor. Responde preguntas usando únicamente la información proporcionada de la empresa si es relevante.`,
      },
      { role: 'user', content: initialMessage }, // El mensaje inicial del usuario
    ],
  };

  // Actualizar el estado de los hilos y seleccionar el nuevo hilo
  setThreads((prev) => [...prev, newThread]); // Añadir el nuevo hilo a la lista de hilos
  setCurrentThreadId(newThread.id); // Establecer el id del nuevo hilo como el hilo seleccionado
};
