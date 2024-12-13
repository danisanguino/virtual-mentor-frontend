import { useState } from "react";
import OpenAI from "openai";
import "./App.css";

const API_KEY: string | undefined = import.meta.env.VITE_OPENAI_API_KEY;

function App() {
  const [message, setMessage] = useState<string>(""); 
  const [messages, setMessages] = useState<OpenAI.Chat.Completions.ChatCompletionMessageParam[]>([
    { role: "system", content: "Eres un asistente útil que responde en español." },
    { role: "assistant", content: "¿En qué puedo ayudarte hoy?" },
  ]); 
  const [loading, setLoading] = useState<boolean>(false); 

  const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const fetchCompletion = async (updatedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) => {
    setLoading(true);
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: updatedMessages,
      });

      const aiResponse = completion.choices[0].message?.content || "";

      setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: aiResponse } as OpenAI.Chat.Completions.ChatCompletionMessageParam,]);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching OpenAI completion:", error);
      setLoading(false);
    }
  };

  const handleForm = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Escribe alguna consulta");
      return;
    }

    // Agregar el mensaje del usuario al historial
    const userMessage = { role: "user", content: message } as OpenAI.Chat.Completions.ChatCompletionMessageParam;

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setMessage(""); 

    fetchCompletion(updatedMessages); 
  };

  return (
    <>
      <h1>Asistente Virtual Mentor</h1>

      <div>
        {messages
          .filter((msg) => msg.role !== "system") 
          .map((msg, index) => (
            <p key={index}>
              <strong>{msg.role === "user" ? "Tú:" : "Asistente:"}</strong> {typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)}
            </p>
          ))}
      </div>

      {loading && <p>El asistente está pensando...</p>}

      <form onSubmit={handleForm}>
        <input
          type="text"
          placeholder="Escribe tu consulta..."
          value={message}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Enviar"}
        </button>
      </form>
    </>
  );
}

export default App;
