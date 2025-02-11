import { useEffect, useRef } from 'react';
import { ConversationsListProps } from '../interfaces/interfaces';

export const Conversations: React.FC<ConversationsListProps> = ({currentThreadId, threads, userName}) => {

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentThreadId])
  

  return (
    <div className="content-conversation-container">
      <div className="content-conversation">
        {currentThreadId ? (
          threads
            .find((thread) => thread.id === currentThreadId)
            ?.messages.filter((msg) => msg.role !== 'system')
            .map((msg, index) => (
              <div key={index} className={`message ${msg.role === 'user' ? 'message__user-message' : 'message__bot-message'}`}>
                <strong>{msg.role === 'user' ? `${userName}` : 'Virtual Mentor'}: </strong>
                <span>{msg.content}</span>
              </div>
            ))
          ) : (
            <p>Crea un hilo para iniciar una conversación o pulsa algún hilo existente.</p>
          )}
          <div ref={messagesEndRef} />
      </div>
    </div>



  )
}
