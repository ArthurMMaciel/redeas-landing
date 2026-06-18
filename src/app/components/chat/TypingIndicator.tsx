import { Sprout } from "lucide-react";

export function TypingIndicator() {
  return (
    <div
      role="status"
      aria-label="Agente está digitando"
      className="flex items-end gap-3"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#173f2b] shadow-sm">
        <Sprout size={16} className="text-[#e1b958]" />
      </div>
      <div>
        <p className="mb-1.5 ml-1 text-[11px] font-semibold text-[#66736a]">
          Agente está digitando...
        </p>
        <div className="flex items-center gap-1.5 rounded-[20px_20px_20px_5px] border border-[#e2e7e1] bg-white px-5 py-4 shadow-sm">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="typing-dot h-2 w-2 rounded-full bg-[#7d9485]"
              style={{ animationDelay: `${dot * 160}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
