import { BarChart3, ReceiptText, Sprout, WalletCards } from "lucide-react";

const suggestions = [
  {
    icon: ReceiptText,
    label: "Registrar uma despesa",
    message: "Gastei R$ 4.200 com adubo no talhão 3.",
  },
  {
    icon: WalletCards,
    label: "Consultar orçamento",
    message: "Quanto ainda tenho disponível no orçamento?",
  },
  {
    icon: BarChart3,
    label: "Ver resumo da safra",
    message: "Mostre um resumo financeiro da safra atual.",
  },
];

export function EmptyConversation({
  onSuggestion,
}: {
  onSuggestion: (message: string) => void;
}) {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#173f2b] shadow-[0_12px_32px_rgba(23,63,43,0.22)]">
        <Sprout size={28} className="text-[#e1b958]" />
      </div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a1823d]">
        Agente Rédeas
      </p>
      <h2 className="font-['Sora'] text-2xl font-bold tracking-[-0.035em] text-[#193d2a] sm:text-3xl">
        Como posso ajudar na sua fazenda?
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-6 text-[#718078]">
        Consulte gastos, registre despesas e acompanhe o orçamento usando uma conversa simples.
      </p>

      <div className="mt-9 grid w-full gap-3 sm:grid-cols-3">
        {suggestions.map(({ icon: Icon, label, message }) => (
          <button
            type="button"
            key={label}
            onClick={() => onSuggestion(message)}
            className="group rounded-2xl border border-[#e0e6df] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#b8c9bc] hover:shadow-md"
          >
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3ed] text-[#356047] transition group-hover:bg-[#dfece1]">
              <Icon size={17} />
            </span>
            <span className="block text-sm font-semibold text-[#334139]">
              {label}
            </span>
            <span className="mt-1 block text-[11px] leading-4 text-[#879189]">
              {message}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
