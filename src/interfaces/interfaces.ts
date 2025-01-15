export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;  
}

export interface IThread {
  id: string;
  title: string;
  messages: ChatCompletionMessage[];
}

export interface ThreadListProps {
  threads: IThread[];
  currentThreadId: string;
  onThreadSelect: (threadId: string) => void;
  onNewThread: (initialMessage: string) => void;
  setThreads: React.Dispatch<React.SetStateAction<IThread[]>>;
  onThreadsUpdate: (updatedThreads: IThread[]) => void;
}

export interface ConversationsListProps {
  threads: IThread[];
  currentThreadId: string;
  userName: string | null;
}

export interface SendMessageProps {
  input: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleForm: (e: React.FormEvent) => void;
}



