import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, Sprout, X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onLogin();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#12271c]/55 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label="Fechar login"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative w-full max-w-md rounded-[28px] border border-white/50 bg-[#fbfaf6] p-7 shadow-[0_28px_80px_rgba(15,39,26,0.3)] sm:p-9">
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-[#6f7b73] transition hover:bg-[#edf1eb]"
        >
          <X size={19} />
        </button>

        <div className="mb-7">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f3d2b]">
            <Sprout size={21} className="text-[#c9a24b]" />
          </div>
          <h2
            id="login-title"
            className="font-['Sora'] text-2xl font-bold tracking-[-0.035em] text-[#1f3d2b]"
          >
            Acesse sua conta
          </h2>
          <p className="mt-2 text-sm text-[#6b766e]">
            Entre para conversar com seu agente financeiro.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#46534a]">
              E-mail
            </span>
            <span className="flex items-center gap-3 rounded-2xl border border-[#dce3dc] bg-white px-4 transition focus-within:border-[#789580]">
              <Mail size={17} className="text-[#879188]" />
              <input
                type="email"
                required
                defaultValue="joao@fazendasantaclara.com.br"
                className="h-13 min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#46534a]">
              Senha
            </span>
            <span className="flex items-center gap-3 rounded-2xl border border-[#dce3dc] bg-white px-4 transition focus-within:border-[#789580]">
              <LockKeyhole size={17} className="text-[#879188]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                defaultValue="redeas-demo"
                className="h-13 min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none"
              />
              <button
                type="button"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPassword((current) => !current)}
                className="text-[#7b867e]"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>

          <div className="flex items-center justify-between py-1 text-xs">
            <label className="flex items-center gap-2 text-[#68746c]">
              <input type="checkbox" defaultChecked className="accent-[#1f5037]" />
              Manter conectado
            </label>
            <button type="button" className="font-semibold text-[#315e43]">
              Esqueci minha senha
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#1f3d2b] py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(31,61,43,0.2)] transition hover:bg-[#285139]"
          >
            Entrar
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-[#8a938c]">
          Ambiente demonstrativo: qualquer e-mail e senha válidos permitem o acesso.
        </p>
      </div>
    </div>
  );
}
