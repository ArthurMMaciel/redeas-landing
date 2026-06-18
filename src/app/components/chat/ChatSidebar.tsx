import { LogOut, MessageSquareText, Plus, Search, X } from "lucide-react";
import type { Conversation } from "../../types/chat";
import { BrandMark } from "./BrandMark";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  isOpen: boolean;
  onClose: () => void;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onLogout: () => void;
}

function getRelativeDate(date: string) {
  const day = new Date(date).getDate();
  const today = new Date().getDate();
  if (day === today) return "Hoje";
  if (day === today - 1) return "Ontem";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  isOpen,
  onClose,
  onNewConversation,
  onSelectConversation,
  onLogout,
}: ChatSidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[294px] shrink-0 flex-col border-r border-[#dfe5de] bg-[#f0f3ee] transition-transform duration-300 lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-[76px] items-center justify-between px-5">
        <BrandMark />
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={onClose}
          className="rounded-xl p-2 text-[#657169] transition hover:bg-white lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={onNewConversation}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#173f2b] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(23,63,43,0.18)] transition hover:bg-[#204f38] active:scale-[0.99]"
        >
          <Plus size={18} />
          Nova conversa
        </button>
      </div>

      <div className="px-4 pb-3">
        <label className="flex items-center gap-2 rounded-xl border border-[#dfe5de] bg-white/70 px-3 py-2.5 text-[#7b867e]">
          <Search size={16} />
          <input
            type="search"
            placeholder="Buscar conversas"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#29362e] outline-none placeholder:text-[#9aa29c]"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#929b94]">
          Conversas recentes
        </p>
        <div className="space-y-1.5">
          {conversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId;
            return (
              <button
                type="button"
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  isActive
                    ? "bg-white shadow-[0_4px_18px_rgba(41,63,48,0.07)]"
                    : "hover:bg-white/60"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isActive
                      ? "bg-[#e7efe8] text-[#286044]"
                      : "bg-[#e4e9e3] text-[#7e8981]"
                  }`}
                >
                  <MessageSquareText size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-[13px] font-semibold ${
                      isActive ? "text-[#193d2a]" : "text-[#4d5a52]"
                    }`}
                  >
                    {conversation.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[#929b94]">
                    {getRelativeDate(conversation.updatedAt)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#dfe5de] p-4">
        <div className="flex items-center gap-3 rounded-2xl px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9a85b] text-xs font-bold text-[#28352d]">
            JS
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#344239]">
              João Silva
            </p>
            <p className="truncate text-[11px] text-[#849087]">
              Fazenda Santa Clara
            </p>
          </div>
          <span className="h-2 w-2 rounded-full bg-[#49a86e]" />
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#68746c] transition hover:bg-white hover:text-[#274d36]"
        >
          <LogOut size={15} />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}
