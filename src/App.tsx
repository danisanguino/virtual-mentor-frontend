import { useEffect, useState } from 'react';
import OpenAI from "openai";
import './App.css'


const API_KEY: string | undefined=  import.meta.env.VITE_OPENAI_API_KEY

function App() {

  const [message, setMessage] = useState<string> ("");
  const [sentMessage, setSentMessage] = useState<string>("Hola, envia tu primer mensaje a nuestro Virtual Mentor");
  const [response, setResponse] = useState<string | null>("Respuesta IA")

  const openai = new OpenAI(
    {
      apiKey: API_KEY,
      dangerouslyAllowBrowser: true,
    }
  );


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const fetchCompletion = async (message: string) => {
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system",
            content: "You are a helpful assistant." },
          {
            role: "user",
            content: message,
          },
        ],
      });

      setResponse(completion.choices[0].message.content || null);

    } catch (error) {
      console.error("Error fetching OpenAI completion: EL FALLO ES AQUI EN EL CATCH");
    }
  };

  const handleForm = (event: React.FormEvent)=> {
    event.preventDefault();
    if (message === "") {
      alert("Escribe alguna consulta")
      return;
    }
    setSentMessage(message);
    setMessage("");

    fetchCompletion(message);
    
  };

  return (
    <>
      <h1>Chat Virtual Mentor</h1>
      <form onSubmit={handleForm}>
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={handleChange} 
        />
        <button type="submit">Enviar</button> 
      </form>

      {sentMessage && (
      <div>
        <strong>Mensaje enviado:</strong> {sentMessage}
      </div>
      )}

      {response && (
        <div>
          <strong>Respuesta de OpenAI:</strong> {response}
        </div>
      )}
    </>
  );
}

export default App;
