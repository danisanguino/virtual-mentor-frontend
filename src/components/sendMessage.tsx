import { SendMessageProps } from '../interfaces/interfaces';


export const SendMessage: React.FC<SendMessageProps> = ({input, handleForm, handleChange}) => {
  return (

  <form onSubmit={handleForm} className='container-send-message'>
    <input
      type="text"
      placeholder="Escribe aquí tu consulta"
      value={input}
      onChange={handleChange}
      className='container-send-message__input'
    />
    <button type="submit" className='button button--send-message'>Enviar</button>
  </form>

  )
}
