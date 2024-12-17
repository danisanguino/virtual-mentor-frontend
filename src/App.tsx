import OpenAI from 'openai';
import './App.css';
import { useEffect, useState } from 'react';
import { infoCompany } from './utils/info';

const API_KEY: string | undefined = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<OpenAI.Chat.Completions.ChatCompletionMessageParam[]>([
    { role: "system", content: "You are a helpful assistant for customer support." },
    { role: "assistant", content: "Soy tu asistente virtual en Virtual Mentor, ¿en qué puedo ayudarte?" },
  ]);
  const [assistant, setAssistant] = useState<OpenAI.Beta.Assistant | null>(null);

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    const createAssistant = async () => {
      const assistantInstance = await openai.beta.assistants.create({
        instructions:`Eres el asistente virtual de Virtual Mentor, estás para que te pregunten cualquier cosa además de temas relacionados con la empresa, para el contexto con información de la empresa usa la información de aqui: ${infoCompany} .`,
        name: "Virtual Mentor",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-3.5-turbo",
      });

      console.log(assistantInstance); // Ver la respuesta de la creación del asistente
      setAssistant(assistantInstance); // Guardar el asistente creado
    };

    createAssistant();
  }, []);

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input === "") {
      return alert("Por favor, escribe una consulta.");
    }

    const userMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: "user",
      content: input,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Utilizamos `openai.chat.completions.create` para enviar los mensajes y obtener una respuesta
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [...messages, userMessage],
      });

      const assistantMessage = response.choices[0]?.message?.content;

      if (assistantMessage) {
        // Asegurarse de que el contenido sea un tipo que React pueda renderizar (string)
        const assistantContent = Array.isArray(assistantMessage)
          ? assistantMessage.join(' ')  // Si es un array, lo unimos en un solo string
          : assistantMessage;

        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: assistantContent },
        ]); // Agregar respuesta del asistente
      }
    } catch (error) {
      console.error("Error al consultar al asistente:", error);
    }

    setInput(""); // Limpiar el campo de entrada
  };

  return (
    <>
      <h1>Asistente Virtual Mentor</h1>
      <form onSubmit={handleForm}>
        <input
          type="text"
          name="consult"
          placeholder="Escribe aquí tu consulta"
          value={input}
          onChange={handleChange}
        />
        <button>Enviar</button>
      </form>

      <div>
        <h3>Conversación:</h3>
        
        {messages
        .filter((msg) => msg.role !== "system")
        .map((msg, index) => (
          <div key={index}>
            <strong>{msg.role === "user" ? "Tú" : "Asistente"}: </strong>
            {typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
