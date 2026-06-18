import { ChevronDown, Menu, ShieldCheck } from "lucide-react";
import { BrandMark } from "./BrandMark";

interface ChatHeaderProps {
  title: string;
  onOpenSidebar: () => void;
}

export function ChatHeader({ title, onOpenSidebar }: ChatHeaderProps) {
  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#e3e7e2] bg-white/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Abrir conversas"
          onClick={onOpenSidebar}
          className="rounded-xl p-2 text-[#4f5d54] transition hover:bg-[#eef2ed] lg:hidden"
        >
          <Menu size={21} />
        </button>
        <div className="lg:hidden">
          <BrandMark compact />
        </div>
        <div className="hidden min-w-0 sm:block">
          <div className="flex items-center gap-1.5">
            <h1 className="truncate font-['Sora'] text-sm font-semibold text-[#233129]">
              {title}
            </h1>
            <ChevronDown size={14} className="text-[#98a199]" />
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#79847c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ead70]" />
            Agente online
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-[#e0e6df] bg-white px-3 py-2 text-[11px] font-medium text-[#607067] shadow-sm sm:px-4">
        <ShieldCheck size={14} className="text-[#3e7657]" />
        <span className="hidden sm:inline">Conversa protegida</span>
        <span className="sm:hidden">Seguro</span>
      </div>
    </header>
  );
}
