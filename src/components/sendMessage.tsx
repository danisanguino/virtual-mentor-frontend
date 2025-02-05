import { SendMessageProps } from '../interfaces/interfaces';
import { handleKeyDown } from '../utils/handleKeyDown';


export const SendMessage: React.FC<SendMessageProps> = ({input, handleForm, handleChange}) => {
  return (

  <form onSubmit={handleForm} className='container-send-message'>
    <textarea
          placeholder="Escribe aquí tu consulta"
          value={input}
          onChange={handleChange}
          // onKeyDown={handleKeyDown}
          className='container-send-message__input'
    >
    </textarea>
    <button type="submit" className='button-send-message button--primary'>Enviar</button>
  </form>

  )
}

