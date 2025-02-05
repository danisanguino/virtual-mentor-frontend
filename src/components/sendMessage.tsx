import { SendMessageProps } from '../interfaces/interfaces';
import { handleKeyDown } from '../utils/handleKeyDown';

export const SendMessage: React.FC<SendMessageProps> = ({
  input,
  handleForm,
  handleChange,
  currentThreadId,
  threads,
  setThreads,
  setInput,
  onNewThread
}) => {

  return (
    <form
      onSubmit={(e) => {
        handleForm(e, input, currentThreadId, threads, setThreads, setInput, onNewThread);
      }}
      className='container-send-message'
    >
      <textarea
        placeholder='Escribe aquí tu consulta'
        value={input}
        onChange={handleChange}
        onKeyDown={(e) => {
          handleKeyDown(e, input, currentThreadId, threads, setThreads, setInput, onNewThread);
        }}
        className='container-send-message__input'
      />
      <button type='submit' className='button-send-message button--primary'>
        Enviar
      </button>
    </form>
  );
};
