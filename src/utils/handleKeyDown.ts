import { IThread } from "../interfaces/interfaces";
import { handleForm } from "./handleForm";

// Click Enter to send message
export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  input: string,
  currentThreadId: string,
  threads: IThread[],
  setThreads: React.Dispatch<React.SetStateAction<IThread[]>>,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  onNewThread: (initialMessage: string) => Promise<string>
) => {

  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleForm(e, input, currentThreadId, threads, setThreads, setInput, onNewThread);
  }
};
