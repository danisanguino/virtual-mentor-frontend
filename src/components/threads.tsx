import React from 'react';
import { ThreadListProps } from '../interfaces/interfaces';
import { deleteThread } from '../utils/firestore';

export const Threads: React.FC<ThreadListProps> = ({
  threads,
  currentThreadId,
  onThreadSelect,
  onNewThread,
  onThreadsUpdate,
}) => {
  const [newThreadTitle, setNewThreadTitle] = React.useState<string>('');
 
  // Manejar el cambio en el título del nuevo hilo
  const handleNewThreadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewThreadTitle(e.target.value);
  };

  const handleNewThreadSubmit = () => {
    if (newThreadTitle) {
      onNewThread(newThreadTitle);
      setNewThreadTitle('');
    } else {
      alert('Por favor, ingresa un título para el nuevo hilo.');
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    try {
      await deleteThread(threadId); // Eliminar el hilo de Firestore
  
      // Actualizar la lista local de hilos
      const updatedThreads = threads.filter((thread) => thread.id !== threadId);
      onThreadsUpdate(updatedThreads); // Nuevo callback para actualizar los hilos
  
      alert(`Hilo con ID ${threadId} eliminado correctamente.`);
    } catch (error) {
      console.error('Error al eliminar el hilo:', error);
      alert('Ocurrió un error al intentar eliminar el hilo. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="threads">
      <div className="new-thread">
        <input
          type="text"
          placeholder="Nuevo hilo"
          value={newThreadTitle}
          onChange={handleNewThreadChange}
        />
        <button onClick={handleNewThreadSubmit}>Crear hilo</button>
      </div>

      <ul>
        {threads.map((thread) => (
          <li
            key={thread.id}
            onClick={() => onThreadSelect(thread.id)}
            className={currentThreadId === thread.id ? 'selected' : ''}
          >
            {thread.title}
            <button onClick={() => handleDeleteThread(thread.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};


