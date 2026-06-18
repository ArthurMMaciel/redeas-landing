import { useState } from "react";
import { Mic, Paperclip, SendHorizonal } from "lucide-react";

interface ChatComposerProps {
  isSending: boolean;
  onSend: (message: string) => void;
}

export function ChatComposer({ isSending, onSend }: ChatComposerProps) {
  const [message, setMessage] = useState("");

  function submit() {
    const content = message.trim();
    if (!content || isSending) return;
    onSend(content);
    setMessage("");
  }

  return (
    <footer className="shrink-0 bg-gradient-to-t from-[#f7f8f5] via-[#f7f8f5] to-transparent px-4 pb-4 pt-3 sm:px-8 sm:pb-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end gap-2 rounded-[24px] border border-[#dce3dc] bg-white p-2 shadow-[0_10px_35px_rgba(31,55,39,0.10)] transition focus-within:border-[#91aa99] focus-within:shadow-[0_12px_38px_rgba(31,74,48,0.13)]">
          <button
            type="button"
            aria-label="Anexar arquivo"
            className="mb-0.5 rounded-full p-2.5 text-[#738078] transition hover:bg-[#edf2ed] hover:text-[#315a40]"
          >
            <Paperclip size={19} />
          </button>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="Pergunte sobre gastos, saldos ou orçamento..."
            aria-label="Mensagem"
            className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-1 py-3 text-sm leading-5 text-[#243128] outline-none placeholder:text-[#9aa29c]"
          />
          <button
            type="button"
            aria-label="Gravar mensagem de voz"
            className="mb-0.5 hidden rounded-full p-2.5 text-[#738078] transition hover:bg-[#edf2ed] sm:block"
          >
            <Mic size={19} />
          </button>
          <button
            type="button"
            aria-label="Enviar mensagem"
            onClick={submit}
            disabled={!message.trim() || isSending}
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1d4b34] text-white shadow-sm transition hover:bg-[#286044] disabled:cursor-not-allowed disabled:bg-[#cbd3cd]"
          >
            <SendHorizonal size={17} />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-[#929b94]">
          O agente pode cometer erros. Confira informações financeiras importantes.
        </p>
      </div>
    </footer>
  );
}
