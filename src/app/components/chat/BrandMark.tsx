import { Sprout } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#173f2b] shadow-[0_8px_20px_rgba(23,63,43,0.18)]">
        <Sprout size={19} strokeWidth={2.2} className="text-[#e1b958]" />
      </div>
      {!compact && (
        <div>
          <p className="font-['Sora'] text-lg font-bold tracking-[-0.03em] text-[#173f2b]">
            Rédeas
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#889189]">
            Agente financeiro
          </p>
        </div>
      )}
    </div>
  );
}
