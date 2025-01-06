import React from 'react';
import { ThreadListProps } from '../interfaces/interfaces';

export const Threads: React.FC<ThreadListProps> = ({
  threads,
  currentThreadId,
  onThreadSelect,
  onNewThread,
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
          </li>
        ))}
      </ul>
    </div>
  );
};
