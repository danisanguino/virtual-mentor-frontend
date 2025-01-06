import { IThread } from "./interfaces";

export interface NewThreadParams {
  initialMessage: string;
  setThreads: React.Dispatch<React.SetStateAction<IThread[]>>;
  setCurrentThreadId: React.Dispatch<React.SetStateAction<string>>;
}