import { ConversationsListProps } from '../interfaces/interfaces';

export const Conversations: React.FC<ConversationsListProps> = ({currentThreadId, threads, userName}) => {
  
  return (
    <div>
        {currentThreadId ? (
          threads
            .find((thread) => thread.id === currentThreadId)
            ?.messages.filter((msg) => msg.role !== 'system')
            .map((msg, index) => (
              <div key={index}>
                <strong>{msg.role === 'user' ? `${userName}` : 'Virtual Mentor'}: </strong>
                <span>{msg.content}</span>
              </div>
            ))
        ) : (
          <p>Crea un hilo para iniciar una conversación.</p>
        )}
    </div>
  )
}
