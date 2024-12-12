import { useEffect, useState } from 'react';
import OpenAI from "openai";
import { Message } from './interfaces/message';
import './App.css'


const API_KEY: string | undefined=  import.meta.env.VITE_OPENAI_API_KEY

function App() {
  const [message, setMessage] = useState<Message | null> ();

  const startConversation = "Hola que tal estas? Me llamo daniel, cuentame algo sobre ti"

  const openai = new OpenAI(
    {
      apiKey: API_KEY,
      dangerouslyAllowBrowser: true,
    }
  );
  const fetchCompletion = async () => {
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: startConversation,
          },
        ],
      });

      setMessage(completion.choices[0].message); 

    } catch (error) {
      console.error("Error fetching OpenAI completion: EL FALLO ES QUI EN EL CATCH");
    }
  };

  useEffect(() => {
    fetchCompletion();
  }, []); 

  return (
    <>
      <h1>Chat Virtual Mentor</h1>
      {message ? (
        <div>
          {/* <h2>Role: {text.role}</h2> */}
          <h3>{message.content}</h3>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <h3>{startConversation}</h3>
      <form>
        <input
        type='text'
        placeholder='Start de conversation with virtual mentor'
        name='message'/>
        <button>Send</button>
      </form>
    </>
  );
}

export default App;
