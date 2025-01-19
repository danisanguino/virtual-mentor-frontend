import React from 'react';
import { ThreadListProps, IThread } from '../interfaces/interfaces';
import { deleteThread } from '../utils/firestore';

export const Threads: React.FC<ThreadListProps> = ({
  threads,
  currentThreadId,
  onThreadSelect,
  onNewThread,
  setThreads, // Asegúrate de recibir setThreads como prop
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

  
  const handleDeleteThread = async (threadId: string, threads: IThread[], setThreads: React.Dispatch<React.SetStateAction<IThread[]>>) => {
    
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este hilo?');
    
    if (!confirmDelete) {
      return;
    }
    
    try {
      // Eliminar el hilo de Firestore y sus mensajes
      await deleteThread(threadId);
  
      // Actualizar los hilos en el estado local
      const updatedThreads = threads.filter((thread) => thread.id !== threadId);
      setThreads(updatedThreads);
  
      console.log(`Hilo con ID ${threadId} eliminado correctamente.`);
    } catch (error) {
      console.error("Error al eliminar el hilo:", error);
    };
  };

  return (
    <div className="container-thread">
      <h2 className='container-thread__title'>Hilos</h2>

      <ul>
        {threads.map((thread) => (
          <li
            key={thread.id}
            onClick={() => onThreadSelect(thread.id)}
            className={currentThreadId === thread.id ? 'selected' : ''}
          >
            {thread.title}
            <button onClick={() => handleDeleteThread(thread.id, threads, setThreads)} className='container-thread__title--button-delete-thread'>Eliminar</button>
          </li>
        ))}
      </ul>

      <div className="container-thread__new-thread">
        <p>Crear un nuevo hilo</p>
        <div className="container-thread__new-thread--separator">
          <input
            type="text"
            placeholder="Nombre del hilo"
            value={newThreadTitle}
            onChange={handleNewThreadChange}
            className='container-thread__new-thread--input'
          />
          <button onClick={handleNewThreadSubmit} className='button button--create-thread'>Crear hilo</button>
        </div>
      </div>

    </div>
  );
};
