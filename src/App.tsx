import OpenAI from 'openai';
import { useEffect, useState } from 'react';
import { infoCompany } from './utils/info';
import { Thread } from './interfaces/message';
import "./App.css"

const API_KEY: string | undefined = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [input, setInput] = useState<string>("");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [assistant, setAssistant] = useState<OpenAI.Beta.Assistant | null>(null);

  const createNewThread = async (firstMessage: string) => {
    const newThread: Thread = {
      id: crypto.randomUUID(),
      title: firstMessage, // Usamos la primera consulta como título
      messages: [
        { role: "assistant", content: "Soy tu asistente virtual en Virtual Mentor, ¿en qué puedo ayudarte?" },
        { role: "user", content: firstMessage },
      ],
    };
  
    setThreads((prev) => [...prev, newThread]);
    setCurrentThreadId(newThread.id);
  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [...newThread.messages],
      });
  
      const assistantMessage = response.choices[0]?.message?.content;
  
      if (assistantMessage) {
        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread.id === newThread.id
              ? {
                  ...thread,
                  messages: [
                    ...thread.messages,
                    { role: "assistant", content: assistantMessage },
                  ],
                }
              : thread
          )
        );
      }
    } catch (error) {
      console.error("Error al consultar al asistente:", error);
    }
  };

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    const createAssistant = async () => {
      const assistantInstance = await openai.beta.assistants.create({
        instructions: `Eres el asistente virtual de Virtual Mentor, estás para que te pregunten cualquier cosa además de temas relacionados con la empresa, para el contexto con información de la empresa usa la información de aqui: ${infoCompany}.`,
        name: "Virtual Mentor",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-3.5-turbo",
      });

      setAssistant(assistantInstance);
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

    if (!currentThreadId) {
      createNewThread(input);
    } else {
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === currentThreadId
            ? { ...thread, messages: [...thread.messages, userMessage] }
            : thread
        )
      );

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [...(currentThreadId ? threads.find((t) => t.id === currentThreadId)?.messages || [] : []), userMessage],
        });

        const assistantMessage = response.choices[0]?.message?.content;

        if (assistantMessage) {
          setThreads((prevThreads) =>
            prevThreads.map((thread) =>
              thread.id === currentThreadId
                ? {
                    ...thread,
                    title: Array.isArray(thread.title) ? thread.title.join(' ') : thread.title || "Nuevo Hilo",
                    messages: [
                      ...thread.messages,
                      { role: "assistant", content: assistantMessage },
                    ],
                  }
                : thread
            )
          );
        }
      } catch (error) {
        console.error("Error al consultar al asistente:", error);
      }
    }

    setInput(""); 
  };

  return (
    <>
      <h1>Asistente Virtual Mentor</h1>
      <button onClick={() => createNewThread(input)}>Crear nuevo hilo</button>

      <div>
        <h3>Hilos:</h3>
        <ul>
          {threads.map((thread) => (
            <li
              key={thread.id}
              onClick={() => setCurrentThreadId(thread.id)}
            >
              {thread.title}
            </li>
          ))}
        </ul>
      </div>

      <div>
        {currentThreadId ? (
          threads
            .find((thread) => thread.id === currentThreadId)
            ?.messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.role === "user" ? "Tú" : "Asistente"}: </strong>
                {Array.isArray(msg.content)
                  ? msg.content.map((part, i) => (
                      <span key={i}>{typeof part === "string" ? part : JSON.stringify(part)}</span>
                    ))
                  : msg.content}
              </div>
            ))
        ) : (
          <p>Envía un mensaje a nuestro Asistente Virtual.</p>
        )}
      </div>

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
    </>
  );
}

export default App;
