export interface Message {
  id: string;
  sender: "user" | "agent";
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
}
