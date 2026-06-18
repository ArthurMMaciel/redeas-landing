import { CheckCheck, Sprout } from "lucide-react";
import type { Message } from "../../types/chat";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.sender === "user";
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(message.createdAt));

  return (
    <article
      className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#173f2b] shadow-sm">
          <Sprout size={16} className="text-[#e1b958]" />
        </div>
      )}

      <div className={`max-w-[82%] sm:max-w-[72%] ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && (
          <p className="mb-1.5 ml-1 text-[11px] font-semibold text-[#66736a]">
            Agente Rédeas
          </p>
        )}
        <div
          className={`px-4 py-3 text-[14px] leading-6 shadow-sm sm:px-5 ${
            isUser
              ? "rounded-[20px_20px_5px_20px] bg-[#1f5037] text-white"
              : "rounded-[20px_20px_20px_5px] border border-[#e2e7e1] bg-white text-[#29362e]"
          }`}
        >
          {message.content}
        </div>
        <div
          className={`mt-1.5 flex items-center gap-1 px-1 text-[10px] text-[#929b94] ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          {time}
          {isUser && <CheckCheck size={13} className="text-[#4f966b]" />}
        </div>
      </div>
    </article>
  );
}
