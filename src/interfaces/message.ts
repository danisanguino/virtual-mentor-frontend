import OpenAI from "openai";

export interface Thread {
  id: string;
  title: string;
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
};
