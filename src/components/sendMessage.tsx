import { SendMessageProps } from '../interfaces/interfaces';


export const SendMessage: React.FC<SendMessageProps> = ({input, handleForm, handleChange}) => {
  return (
    <form onSubmit={handleForm}>
    <input
      type="text"
      placeholder="Escribe aquí tu consulta"
      value={input}
      onChange={handleChange}
    />
    <button type="submit">Enviar</button>
  </form>
  )
}
