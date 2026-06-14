import { useState, useEffect } from "react";
import {
  Smartphone,
  MessageSquare,
  BarChart3,
  Check,
  ChevronDown,
  ArrowRight,
  Bell,
  CreditCard,
  Fuel,
  Users,
  Calendar,
  ShieldCheck,
  Zap,
  TrendingUp,
  Menu,
  X,
  Star,
  Sprout,
  Tractor,
  ClipboardList,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = {
  bg: "#F8F6F1",
  green: "#1F3D2B",
  olive: "#6B7A4F",
  gold: "#C9A24B",
  text: "#1A1A1A",
  textLight: "#F8F6F1",
  muted: "#6B6B5A",
  border: "rgba(31,61,43,0.12)",
  cardBg: "#FFFFFF",
};

const WHATSAPP_CTA_URL = "https://wa.me/5544998924520?text=Ol%C3%A1.%20Quero%20testar%20o%20agente%20r%C3%A9deas";

const chartData = [
  { mes: "Jan", planejado: 45000, realizado: 38000 },
  { mes: "Fev", planejado: 52000, realizado: 49000 },
  { mes: "Mar", planejado: 61000, realizado: 67000 },
  { mes: "Abr", planejado: 48000, realizado: 44000 },
  { mes: "Mai", planejado: 70000, realizado: 65000 },
  { mes: "Jun", planejado: 55000, realizado: 58000 },
];

const faqItems = [
  {
    q: "Meus dados são seguros no Rédeas?",
    a: "Sim. Todos os dados são criptografados em trânsito e em repouso com AES-256. Nunca compartilhamos suas informações com terceiros sem sua autorização expressa.",
  },
  {
    q: "O Rédeas está em conformidade com a LGPD?",
    a: "Completamente. Somos auditados anualmente por consultoria especializada em proteção de dados. Você pode exportar ou excluir todos os seus dados a qualquer momento direto pelo WhatsApp.",
  },
  {
    q: "Funciona integrado ao meu banco?",
    a: "Estamos em fase beta de integração com os principais bancos agrícolas (Banco do Brasil, Bradesco Agro, Sicredi). Por enquanto, você registra manualmente via chat — o que leva menos de 10 segundos.",
  },
  {
    q: "E se eu estiver sem internet na fazenda?",
    a: "As mensagens ficam salvas no WhatsApp e são processadas assim que a conexão retornar. Nada se perde.",
  },
  {
    q: "Que tipo de suporte vocês oferecem?",
    a: "Suporte via WhatsApp em horário comercial (seg–sex, 8h–18h) para todos os planos. O plano Empresarial inclui gerente de conta dedicado.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim, sem burocracia. Cancele pelo WhatsApp com um aviso de 30 dias. Seus dados ficam disponíveis para exportação por mais 60 dias após o cancelamento.",
  },
];

const testimonials = [
  {
    name: "Carlos Henrique Melo",
    role: "Produtor de soja",
    location: "Sorriso, MT",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    text: "Antes eu anotava tudo num caderno e perdia noção dos gastos. Agora mando uma mensagem e pronto — no fim do mês tenho o relatório completo por talhão.",
  },
  {
    name: "Fernanda Rocha",
    role: "Consultora agrícola",
    location: "Ribeirão Preto, SP",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
    text: "Recomendo para todos os meus clientes. A visão de Planejado x Realizado mudou completamente a conversa com os produtores na hora de fechar a safra.",
  },
  {
    name: "Ricardo Alves",
    role: "Gestor de fazenda",
    location: "Barreiras, BA",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
    text: "Gerencio três fazendas com equipes diferentes. O Rédeas me dá controle de todas elas num lugar só, sem planilha nem sistema complicado.",
  },
];

const plans = [
  {
    name: "Essencial",
    price: "R$ 97",
    period: "/mês",
    desc: "Para o produtor que quer controle básico das despesas.",
    featured: false,
    features: [
      "Registro ilimitado de despesas",
      "Categorias agrícolas prontas",
      "Relatório mensal",
      "1 fazenda",
      "Suporte via chat",
    ],
  },
  {
    name: "Profissional",
    price: "R$ 197",
    period: "/mês",
    desc: "O mais completo para quem leva a gestão a sério.",
    featured: true,
    features: [
      "Tudo do Essencial",
      "Planejado x Realizado por safra",
      "Alertas de orçamento",
      "Compras parceladas e cartões",
      "Até 5 fazendas",
      "Relatórios personalizados",
      "Suporte prioritário",
    ],
  },
  {
    name: "Empresarial",
    price: "Sob consulta",
    period: "",
    desc: "Para grupos, cooperativas e consultorias com múltiplos clientes.",
    featured: false,
    features: [
      "Tudo do Profissional",
      "Fazendas ilimitadas",
      "Multi-usuário",
      "API de integração",
      "Gerente de conta dedicado",
      "SLA garantido",
    ],
  },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Recursos", href: "#recursos" },
    { label: "Planos", href: "#planos" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(248,246,241,0.92)" : "rgba(248,246,241,0.6)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? `1px solid ${COLORS.border}` : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: COLORS.green }}
          >
            <Sprout size={16} color={COLORS.gold} />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "Sora, sans-serif", color: COLORS.green }}
          >
            Rédeas
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: COLORS.text, fontFamily: "Inter, sans-serif" }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex">
          <a
            href={WHATSAPP_CTA_URL}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: COLORS.green,
              color: COLORS.textLight,
              fontFamily: "Sora, sans-serif",
            }}
          >
            Teste 15 dias
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: COLORS.green }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
          style={{ background: "rgba(248,246,241,0.97)" }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium py-2"
              style={{ color: COLORS.text }}
            >
              {l.label}
            </a>
          ))}
          <a
            href={WHATSAPP_CTA_URL}
            target="_blank"
            rel="noreferrer"
            className="text-center px-5 py-3 rounded-xl text-sm font-semibold mt-2"
            style={{ background: COLORS.green, color: COLORS.textLight }}
          >
            Teste 15 dias grátis
          </a>
        </div>
      )}
    </nav>
  );
}

function WhatsAppMockup() {
  const messages = [
    { from: "user", text: "Gastei R$ 4.200 com adubo no talhão 3" },
    {
      from: "agent",
      text: "✅ Registrado! Aqui está o resumo:",
      extra: true,
    },
    { from: "user", text: "Qual meu saldo de insumos esse mês?" },
    {
      from: "agent",
      text: "Você usou R$ 18.400 de R$ 27.000 planejados para insumos — 68% do orçamento.",
    },
  ];

  return (
    <div className="relative flex justify-center items-center">
      {/* Floating card: Saldo */}
      <div
        className="absolute -left-4 top-8 z-20 rounded-2xl shadow-xl px-4 py-3 hidden lg:flex flex-col gap-1"
        style={{ background: COLORS.green, minWidth: 160 }}
      >
        <span className="text-xs font-medium opacity-70" style={{ color: COLORS.textLight, fontFamily: "Inter" }}>
          Saldo da safra
        </span>
        <span className="text-lg font-bold" style={{ color: COLORS.gold, fontFamily: "Sora" }}>
          R$ 142.800
        </span>
        <div className="flex items-center gap-1 mt-0.5">
          <TrendingUp size={12} color="#6EE7A0" />
          <span className="text-xs" style={{ color: "#6EE7A0", fontFamily: "Inter" }}>+8% vs. planejado</span>
        </div>
      </div>

      {/* Floating card: Categoria */}
      <div
        className="absolute -right-6 top-16 z-20 rounded-2xl shadow-xl px-4 py-3 hidden lg:flex flex-col gap-1"
        style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, minWidth: 160 }}
      >
        <span className="text-xs font-medium" style={{ color: COLORS.muted, fontFamily: "Inter" }}>Categoria</span>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "#EDE9E0" }}>
            <Sprout size={12} color={COLORS.green} />
          </span>
          <span className="text-sm font-semibold" style={{ color: COLORS.text, fontFamily: "Sora" }}>Insumos</span>
        </div>
      </div>

      {/* Floating card: Orçamento */}
      <div
        className="absolute -right-4 bottom-20 z-20 rounded-2xl shadow-xl px-4 py-3 hidden lg:flex flex-col gap-2"
        style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, minWidth: 170 }}
      >
        <span className="text-xs font-medium" style={{ color: COLORS.muted, fontFamily: "Inter" }}>Restante do orçamento</span>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold" style={{ color: COLORS.green, fontFamily: "Sora" }}>68%</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#E8F5E9", color: "#2E7D32" }}>
            No controle
          </span>
        </div>
        <div className="w-full rounded-full h-2" style={{ background: "#EDE9E0" }}>
          <div className="h-2 rounded-full" style={{ background: COLORS.gold, width: "68%" }} />
        </div>
      </div>

      {/* Phone */}
      <div
        className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl"
        style={{
          width: 300,
          background: "#075E54",
          border: "8px solid #1A1A1A",
        }}
      >
        {/* WA Header */}
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: "#075E54" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: COLORS.gold }}>
            <Sprout size={16} color="white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white" style={{ fontFamily: "Sora" }}>Rédeas Agent</p>
            <p className="text-xs text-green-200">online</p>
          </div>
        </div>

        {/* Chat */}
        <div
          className="px-3 py-4 flex flex-col gap-3 min-h-[420px]"
          style={{ background: "#ECE5DD" }}
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className="px-3 py-2 rounded-2xl max-w-[80%] shadow-sm"
                style={{
                  background: m.from === "user" ? "#DCF8C6" : "#FFFFFF",
                  borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                }}
              >
                <p className="text-xs leading-relaxed" style={{ color: "#1A1A1A", fontFamily: "Inter" }}>
                  {m.text}
                </p>
                {m.extra && (
                  <div className="mt-2 rounded-xl p-2.5" style={{ background: "#F0F7F4", border: "1px solid #C8E6C9" }}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: COLORS.muted }}>Valor</span>
                      <span className="font-semibold" style={{ color: COLORS.green }}>R$ 4.200</span>
                    </div>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: COLORS.muted }}>Categoria</span>
                      <span className="font-semibold" style={{ color: COLORS.green }}>Insumos</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: COLORS.muted }}>Talhão</span>
                      <span className="font-semibold" style={{ color: COLORS.green }}>Talhão 3</span>
                    </div>
                  </div>
                )}
                <p className="text-right text-[10px] mt-1" style={{ color: "#999" }}>
                  {["09:14", "09:14", "09:16", "09:16"][i]} ✓✓
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="px-3 py-2 flex items-center gap-2" style={{ background: "#F0F0F0" }}>
          <div className="flex-1 rounded-full px-4 py-2 text-xs" style={{ background: "white", color: COLORS.muted, fontFamily: "Inter" }}>
            Digite uma mensagem...
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#25D366" }}>
            <MessageSquare size={16} color="white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  const avatars = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format",
  ];

  return (
    <section className="min-h-screen flex items-center pt-20 pb-16 px-6">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="flex flex-col gap-8">
          {/* Badge */}
          <div className="inline-flex w-fit">
            <span
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full"
              style={{
                background: "rgba(201,162,75,0.12)",
                color: "#8A6A1F",
                border: "1px solid rgba(201,162,75,0.3)",
                fontFamily: "Inter",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: COLORS.gold }} />
              Novo • Agente no WhatsApp
            </span>
          </div>

          {/* H1 */}
          <h1
            className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
            style={{ color: COLORS.green, fontFamily: "Sora, sans-serif", letterSpacing: "-0.03em" }}
          >
            Tenha as rédeas da sua fazenda no WhatsApp
          </h1>

          <p className="text-lg leading-relaxed" style={{ color: COLORS.muted, fontFamily: "Inter", maxWidth: 480 }}>
            Registre gastos, acompanhe orçamentos e veja relatórios por safra — tudo por mensagem, sem app novo, sem planilha.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <a
              href={WHATSAPP_CTA_URL}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90 active:scale-95 shadow-lg"
              style={{
                background: COLORS.gold,
                color: COLORS.text,
                fontFamily: "Sora, sans-serif",
                boxShadow: "0 4px 24px rgba(201,162,75,0.35)",
              }}
            >
              Teste grátis por 15 dias
            </a>
            <a
              href="#como-funciona"
              className="flex items-center gap-2 px-4 py-4 font-medium text-base transition-all hover:opacity-70"
              style={{ color: COLORS.green, fontFamily: "Sora, sans-serif" }}
            >
              Ver demo
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="produtor rural"
                  className="w-9 h-9 rounded-full border-2 object-cover"
                  style={{ borderColor: COLORS.bg, background: COLORS.muted }}
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill={COLORS.gold} color={COLORS.gold} />
                ))}
              </div>
              <p className="text-sm" style={{ color: COLORS.muted, fontFamily: "Inter" }}>
                <strong style={{ color: COLORS.text }}>+200 produtores</strong> já usam o Rédeas
              </p>
            </div>
          </div>
        </div>

        {/* Right: mockup */}
        <div className="flex justify-center lg:justify-end">
          <WhatsAppMockup />
        </div>
      </div>
    </section>
  );
}

function LogoBar() {
  const partners = [
    "Coamo", "Cocamar", "Aprosoja", "Celg Agro", "Sicredi Rural", "Embrapa Parceiro"
  ];

  return (
    <div className="py-10 border-y" style={{ borderColor: COLORS.border }}>
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-medium mb-6 uppercase tracking-widest" style={{ color: COLORS.muted, fontFamily: "Inter" }}>
          Parceiros e cooperativas
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
          {partners.map((p) => (
            <span
              key={p}
              className="text-base font-bold tracking-tight opacity-30"
              style={{ color: COLORS.green, fontFamily: "Sora" }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: <Smartphone size={28} color={COLORS.gold} />,
      num: "01",
      title: "Conecte seu WhatsApp",
      desc: "Escaneie o QR Code e o agente está pronto em menos de 2 minutos. Sem instalação.",
      preview: (
        <div className="rounded-xl p-3 text-xs" style={{ background: "#F0F7F4", border: `1px solid ${COLORS.border}` }}>
          <p className="font-semibold mb-2" style={{ color: COLORS.green, fontFamily: "Sora" }}>Conectar agente</p>
          <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center" style={{ background: COLORS.green }}>
            <div className="grid grid-cols-3 gap-0.5">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-sm" style={{ background: i % 2 === 0 ? COLORS.gold : "transparent" }} />
              ))}
            </div>
          </div>
          <p className="text-center mt-2" style={{ color: COLORS.muted, fontFamily: "Inter" }}>Escaneie para ativar</p>
        </div>
      ),
    },
    {
      icon: <MessageSquare size={28} color={COLORS.gold} />,
      num: "02",
      title: "Converse naturalmente",
      desc: "Fale como você fala. \"Comprei 200 litros de diesel\" ou \"paguei R$ 3.000 de diária\" — o agente entende.",
      preview: (
        <div className="rounded-xl p-3 flex flex-col gap-2" style={{ background: "#ECE5DD" }}>
          <div className="self-end bg-[#DCF8C6] rounded-xl px-3 py-1.5 text-xs max-w-[90%]" style={{ fontFamily: "Inter", borderRadius: "12px 12px 3px 12px" }}>
            Comprei 200L de diesel — R$ 1.840
          </div>
          <div className="self-start bg-white rounded-xl px-3 py-1.5 text-xs max-w-[90%]" style={{ fontFamily: "Inter", borderRadius: "12px 12px 12px 3px" }}>
            ✅ Registrado em Combustível! Saldo: R$ 8.160
          </div>
        </div>
      ),
    },
    {
      icon: <BarChart3 size={28} color={COLORS.gold} />,
      num: "03",
      title: "Veja relatórios em tempo real",
      desc: "Acompanhe gastos por categoria, talhão ou safra. Receba alertas quando o orçamento estiver no limite.",
      preview: (
        <div className="rounded-xl p-3" style={{ background: "#F8F6F1", border: `1px solid ${COLORS.border}` }}>
          <p className="text-xs font-semibold mb-2" style={{ color: COLORS.green, fontFamily: "Sora" }}>Resumo de maio</p>
          {["Insumos", "Combustível", "Mão de obra"].map((cat, i) => (
            <div key={cat} className="flex items-center gap-2 mb-1.5">
              <span className="text-xs w-20 truncate" style={{ color: COLORS.muted, fontFamily: "Inter" }}>{cat}</span>
              <div className="flex-1 rounded-full h-1.5" style={{ background: "#EDE9E0" }}>
                <div className="h-1.5 rounded-full" style={{ background: [COLORS.green, COLORS.olive, COLORS.gold][i], width: ["75%", "45%", "60%"][i] }} />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section id="como-funciona" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: COLORS.gold, fontFamily: "Inter" }}>
            Como funciona
          </p>
          <h2 className="text-4xl font-bold" style={{ color: COLORS.green, fontFamily: "Sora" }}>
            Três passos. Zero complicação.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-7 flex flex-col gap-5"
              style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, boxShadow: "0 2px 16px rgba(31,61,43,0.06)" }}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,162,75,0.1)" }}>
                  {s.icon}
                </div>
                <span className="text-3xl font-bold opacity-10" style={{ color: COLORS.green, fontFamily: "Sora" }}>{s.num}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.green, fontFamily: "Sora" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.muted, fontFamily: "Inter" }}>{s.desc}</p>
              </div>
              {s.preview}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResourcesSection() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl px-3 py-2 shadow-lg" style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
          <p className="text-xs font-semibold mb-1" style={{ color: COLORS.green, fontFamily: "Sora" }}>{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} className="text-xs" style={{ color: p.color, fontFamily: "Inter" }}>
              {p.name === "planejado" ? "Planejado" : "Realizado"}: R$ {(p.value / 1000).toFixed(0)}k
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section id="recursos" className="py-24 px-6" style={{ background: "#F0EDE5" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: COLORS.gold, fontFamily: "Inter" }}>
            Recursos
          </p>
          <h2 className="text-4xl font-bold" style={{ color: COLORS.green, fontFamily: "Sora" }}>
            Tudo o que você precisa para fechar a safra no azul
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-auto">

          {/* Card grande: Dashboard */}
          <div
            className="md:col-span-3 lg:col-span-4 rounded-2xl p-6"
            style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, boxShadow: "0 2px 20px rgba(31,61,43,0.07)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base" style={{ color: COLORS.green, fontFamily: "Sora" }}>Planejado × Realizado</h3>
                <p className="text-xs mt-0.5" style={{ color: COLORS.muted, fontFamily: "Inter" }}>Safra 2024/25 — Visualização semestral</p>
              </div>
              <div className="flex gap-3">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: COLORS.muted, fontFamily: "Inter" }}>
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS.green }} />Planejado
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: COLORS.muted, fontFamily: "Inter" }}>
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS.gold }} />Realizado
                </span>
              </div>
            </div>

            {/* KPI mini-cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Total planejado", value: "R$ 331k" },
                { label: "Total realizado", value: "R$ 321k" },
                { label: "Variação", value: "-3%", positive: true },
              ].map((k) => (
                <div key={k.label} className="rounded-xl p-3" style={{ background: "#F8F6F1" }}>
                  <p className="text-xs mb-1" style={{ color: COLORS.muted, fontFamily: "Inter" }}>{k.label}</p>
                  <p className="font-bold text-sm" style={{ color: k.positive ? "#2E7D32" : COLORS.green, fontFamily: "Sora" }}>{k.value}</p>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barCategoryGap="30%">
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: COLORS.muted, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="planejado" fill={COLORS.green} radius={[4, 4, 0, 0]} />
                <Bar dataKey="realizado" fill={COLORS.gold} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Card médio: Categorias */}
          <div
            className="md:col-span-3 lg:col-span-2 rounded-2xl p-6"
            style={{ background: COLORS.green }}
          >
            <h3 className="font-bold text-base mb-4" style={{ color: COLORS.textLight, fontFamily: "Sora" }}>
              Categorias agrícolas
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { icon: <Sprout size={14} color={COLORS.green} />, label: "Insumos", value: "R$ 18.400", pct: "42%" },
                { icon: <Fuel size={14} color={COLORS.green} />, label: "Combustível", value: "R$ 9.200", pct: "21%" },
                { icon: <Users size={14} color={COLORS.green} />, label: "Mão de obra", value: "R$ 14.800", pct: "33%" },
                { icon: <Tractor size={14} color={COLORS.green} />, label: "Maquinário", value: "R$ 1.800", pct: "4%" },
              ].map((cat) => (
                <div key={cat.label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: COLORS.gold }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: "rgba(248,246,241,0.85)", fontFamily: "Inter" }}>{cat.label}</span>
                      <span className="text-xs font-bold" style={{ color: COLORS.gold, fontFamily: "Sora" }}>{cat.pct}</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ background: "rgba(248,246,241,0.15)" }}>
                      <div className="h-1.5 rounded-full" style={{ background: COLORS.gold, width: cat.pct }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card pequeno: Alertas */}
          <div
            className="md:col-span-1 lg:col-span-2 rounded-2xl p-5"
            style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,162,75,0.12)" }}>
                <Bell size={16} color={COLORS.gold} />
              </div>
              <h3 className="font-bold text-sm" style={{ color: COLORS.green, fontFamily: "Sora" }}>Alertas de orçamento</h3>
            </div>
            <div className="rounded-xl p-3 mb-3" style={{ background: "#FFF8E1", border: "1px solid #FFE082" }}>
              <p className="text-xs font-semibold" style={{ color: "#8A6A1F", fontFamily: "Inter" }}>⚠️ Insumos 85% usado</p>
              <p className="text-xs mt-0.5" style={{ color: "#A07820", fontFamily: "Inter" }}>Faltam R$ 4.200 para o limite</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: "#E8F5E9", border: "1px solid #C8E6C9" }}>
              <p className="text-xs font-semibold" style={{ color: "#2E7D32", fontFamily: "Inter" }}>✅ Mão de obra ok</p>
              <p className="text-xs mt-0.5" style={{ color: "#388E3C", fontFamily: "Inter" }}>68% do orçamento disponível</p>
            </div>
          </div>

          {/* Card médio: Parcelamentos */}
          <div
            className="md:col-span-2 lg:col-span-2 rounded-2xl p-5"
            style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(31,61,43,0.08)" }}>
                <CreditCard size={16} color={COLORS.green} />
              </div>
              <h3 className="font-bold text-sm" style={{ color: COLORS.green, fontFamily: "Sora" }}>Compras parceladas</h3>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { desc: "Sementes Pioneer", total: "R$ 12.000", parcelas: "3x R$ 4.000", status: 1 },
                { desc: "Adubo NPK", total: "R$ 8.400", parcelas: "2x R$ 4.200", status: 2 },
                { desc: "Defensivos", total: "R$ 5.600", parcelas: "4x R$ 1.400", status: 0 },
              ].map((item) => (
                <div key={item.desc} className="flex items-center justify-between py-2 border-b" style={{ borderColor: COLORS.border }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: COLORS.text, fontFamily: "Inter" }}>{item.desc}</p>
                    <p className="text-xs" style={{ color: COLORS.muted, fontFamily: "Inter" }}>{item.parcelas}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold" style={{ color: COLORS.green, fontFamily: "Sora" }}>{item.total}</p>
                    <div className="flex gap-0.5 mt-1 justify-end">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full" style={{ background: i < item.status ? COLORS.green : "#EDE9E0" }} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card pequeno: Planejamento */}
          <div
            className="md:col-span-1 lg:col-span-2 rounded-2xl p-5"
            style={{ background: COLORS.olive }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(248,246,241,0.15)" }}>
                <Calendar size={16} color={COLORS.textLight} />
              </div>
              <h3 className="font-bold text-sm" style={{ color: COLORS.textLight, fontFamily: "Sora" }}>Planejamento de safra</h3>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { fase: "Plantio", date: "15 Out", done: true },
                { fase: "Adubação", date: "02 Nov", done: true },
                { fase: "Defensivos", date: "18 Nov", done: false },
                { fase: "Colheita", date: "Mar 25", done: false },
              ].map((f) => (
                <div key={f.fase} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: f.done ? COLORS.gold : "rgba(248,246,241,0.2)" }}>
                    {f.done && <Check size={9} color={COLORS.text} strokeWidth={3} />}
                  </div>
                  <span className="text-xs flex-1" style={{ color: f.done ? "rgba(248,246,241,0.9)" : "rgba(248,246,241,0.6)", fontFamily: "Inter" }}>{f.fase}</span>
                  <span className="text-xs font-medium" style={{ color: COLORS.gold, fontFamily: "Sora" }}>{f.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card grande: NLP */}
          <div
            className="md:col-span-3 lg:col-span-6 rounded-2xl p-6"
            style={{ background: "#1A2B1F" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(201,162,75,0.15)", color: COLORS.gold, border: "1px solid rgba(201,162,75,0.2)" }}>
                  <Zap size={12} color={COLORS.gold} />
                  Linguagem natural
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: COLORS.textLight, fontFamily: "Sora" }}>
                  Fale como você fala. O agente entende.
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(248,246,241,0.6)", fontFamily: "Inter" }}>
                  Nosso motor de NLP foi treinado com o vocabulário do agro brasileiro. Talhão, safra, custeio, arrendamento — o agente categoriza tudo automaticamente, sem você configurar nada.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Talhão", "Safra 24/25", "Custeio", "Arrendamento", "Colheita", "Insumos"].map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(201,162,75,0.1)", color: COLORS.gold, border: "1px solid rgba(201,162,75,0.15)", fontFamily: "Inter" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chat NLP demo */}
              <div className="rounded-2xl p-4" style={{ background: "#ECE5DD" }}>
                {[
                  { from: "user", text: "Paguei 3 diárias pro pessoal da colheita, R$ 250 cada" },
                  { from: "agent", text: "Entendido! 3× R$ 250 = R$ 750 → Mão de obra / Colheita. Confirmo?" },
                  { from: "user", text: "Sim" },
                  { from: "agent", text: "✅ R$ 750 registrado! Mão de obra este mês: R$ 15.550 de R$ 22.000 planejados." },
                ].map((m, i) => (
                  <div key={i} className={`flex mb-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className="px-3 py-2 max-w-[85%] text-xs leading-relaxed shadow-sm"
                      style={{
                        background: m.from === "user" ? "#DCF8C6" : "white",
                        borderRadius: m.from === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                        fontFamily: "Inter",
                        color: COLORS.text,
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ForWhomSection() {
  const cards = [
    {
      title: "Produtor rural",
      photo: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop&auto=format",
      bullets: [
        "Registre gastos na hora, no campo",
        "Saiba onde vai cada real da safra",
        "Relatórios prontos para o banco",
        "Sem planilha, sem app complicado",
      ],
      icon: <Tractor size={18} color={COLORS.gold} />,
    },
    {
      title: "Consultor agrícola",
      photo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop&auto=format",
      bullets: [
        "Gerencie múltiplos clientes",
        "Dados financeiros em tempo real",
        "Relatórios para apresentação",
        "Alertas automáticos por cliente",
      ],
      icon: <ClipboardList size={18} color={COLORS.gold} />,
    },
    {
      title: "Gestor de fazenda",
      photo: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop&auto=format",
      bullets: [
        "Visão consolidada de todas as fazendas",
        "Controle por talhão e equipe",
        "Aprovação de gastos pelo WhatsApp",
        "Dashboard executivo completo",
      ],
      icon: <BarChart3 size={18} color={COLORS.gold} />,
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: COLORS.gold, fontFamily: "Inter" }}>
            Para quem é
          </p>
          <h2 className="text-4xl font-bold" style={{ color: COLORS.green, fontFamily: "Sora" }}>
            Do campo ao escritório, o Rédeas se adapta
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl overflow-hidden group"
              style={{ border: `1px solid ${COLORS.border}`, boxShadow: "0 2px 16px rgba(31,61,43,0.07)" }}
            >
              <div className="relative h-48 overflow-hidden" style={{ background: COLORS.muted }}>
                <img
                  src={card.photo}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(31,61,43,0.7) 0%, transparent 60%)" }} />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(201,162,75,0.2)", backdropFilter: "blur(8px)" }}>
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Sora" }}>{card.title}</h3>
                </div>
              </div>
              <div className="p-6" style={{ background: COLORS.cardBg }}>
                <ul className="flex flex-col gap-3">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <Check size={15} color={COLORS.gold} className="mt-0.5 flex-shrink-0" />
                      <span className="text-sm" style={{ color: COLORS.muted, fontFamily: "Inter" }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-24 px-6" style={{ background: "#F0EDE5" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: COLORS.gold, fontFamily: "Inter" }}>
            Depoimentos
          </p>
          <h2 className="text-4xl font-bold" style={{ color: COLORS.green, fontFamily: "Sora" }}>
            Quem usa, recomenda
          </h2>
        </div>

        {/* Desktop: 3 cards */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl p-7"
              style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, boxShadow: "0 2px 20px rgba(31,61,43,0.07)" }}
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={COLORS.gold} color={COLORS.gold} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.text, fontFamily: "Inter" }}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <img src={t.photo} alt={t.name} className="w-11 h-11 rounded-full object-cover" style={{ background: COLORS.muted }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: COLORS.green, fontFamily: "Sora" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: COLORS.muted, fontFamily: "Inter" }}>{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: carrossel */}
        <div className="md:hidden">
          <div
            className="rounded-2xl p-7"
            style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}
          >
            <div className="flex gap-1 mb-5">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={COLORS.gold} color={COLORS.gold} />)}
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.text, fontFamily: "Inter" }}>
              "{testimonials[current].text}"
            </p>
            <div className="flex items-center gap-3">
              <img src={testimonials[current].photo} alt={testimonials[current].name} className="w-11 h-11 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold" style={{ color: COLORS.green, fontFamily: "Sora" }}>{testimonials[current].name}</p>
                <p className="text-xs" style={{ color: COLORS.muted, fontFamily: "Inter" }}>{testimonials[current].role} · {testimonials[current].location}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === current ? COLORS.gold : COLORS.border }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="planos" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: COLORS.gold, fontFamily: "Inter" }}>
            Planos
          </p>
          <h2 className="text-4xl font-bold" style={{ color: COLORS.green, fontFamily: "Sora" }}>
            Simples, sem surpresa
          </h2>
          <p className="mt-3 text-base" style={{ color: COLORS.muted, fontFamily: "Inter" }}>
            15 dias grátis. Sem cartão de crédito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl p-7 relative"
              style={{
                background: plan.featured ? COLORS.green : COLORS.cardBg,
                border: plan.featured ? `2px solid ${COLORS.gold}` : `1px solid ${COLORS.border}`,
                boxShadow: plan.featured ? "0 8px 40px rgba(31,61,43,0.25)" : "0 2px 16px rgba(31,61,43,0.06)",
              }}
            >
              {plan.featured && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{ background: COLORS.gold, color: COLORS.text, fontFamily: "Sora", whiteSpace: "nowrap" }}
                >
                  ★ Mais escolhido
                </div>
              )}

              <div className="mb-5">
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ color: plan.featured ? COLORS.textLight : COLORS.green, fontFamily: "Sora" }}
                >
                  {plan.name}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: plan.featured ? "rgba(248,246,241,0.6)" : COLORS.muted, fontFamily: "Inter" }}>
                  {plan.desc}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ color: plan.featured ? COLORS.gold : COLORS.green, fontFamily: "Sora" }}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm ml-1" style={{ color: plan.featured ? "rgba(248,246,241,0.5)" : COLORS.muted, fontFamily: "Inter" }}>
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check size={15} color={plan.featured ? COLORS.gold : COLORS.olive} className="flex-shrink-0" />
                    <span className="text-sm" style={{ color: plan.featured ? "rgba(248,246,241,0.85)" : COLORS.text, fontFamily: "Inter" }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.featured ? (
                <a
                  href={WHATSAPP_CTA_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: COLORS.gold, color: COLORS.text, fontFamily: "Sora" }}
                >
                  Teste grátis por 15 dias
                </a>
              ) : (
                <a
                  href={WHATSAPP_CTA_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
                  style={{
                    background: "transparent",
                    color: plan.featured ? COLORS.textLight : COLORS.green,
                    border: `1.5px solid ${plan.featured ? "rgba(248,246,241,0.3)" : COLORS.border}`,
                    fontFamily: "Sora",
                  }}
                >
                  {plan.name === "Empresarial" ? "Falar com vendas" : "Começar grátis"}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6" style={{ background: "#F0EDE5" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: COLORS.gold, fontFamily: "Inter" }}>
            FAQ
          </p>
          <h2 className="text-4xl font-bold" style={{ color: COLORS.green, fontFamily: "Sora" }}>
            Perguntas frequentes
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 transition-colors hover:bg-stone-50"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold" style={{ color: COLORS.green, fontFamily: "Sora" }}>
                  {item.q}
                </span>
                <ChevronDown
                  size={18}
                  color={COLORS.gold}
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.muted, fontFamily: "Inter" }}>
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: COLORS.green }}>
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #F8F6F1 0px, #F8F6F1 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, #F8F6F1 0px, #F8F6F1 1px, transparent 1px, transparent 12px)`,
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-8" style={{ background: "rgba(201,162,75,0.15)", color: COLORS.gold, border: "1px solid rgba(201,162,75,0.25)" }}>
          <ShieldCheck size={13} color={COLORS.gold} />
          Sem cartão de crédito • Cancele quando quiser
        </div>

        <h2
          className="text-4xl md:text-5xl font-bold mb-5 leading-tight"
          style={{ color: COLORS.textLight, fontFamily: "Sora", letterSpacing: "-0.03em" }}
        >
          Cadastre, teste 15 dias e assine quando fizer sentido
        </h2>
        <p className="text-base mb-10 leading-relaxed" style={{ color: "rgba(248,246,241,0.65)", fontFamily: "Inter" }}>
          Comece hoje com a fazenda organizada no WhatsApp. Se não fizer sentido, é só parar — sem burocracia.
        </p>

        <a
          href={WHATSAPP_CTA_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-block px-10 py-5 rounded-2xl font-bold text-base transition-all hover:opacity-90 active:scale-95 shadow-xl"
          style={{
            background: COLORS.gold,
            color: COLORS.text,
            fontFamily: "Sora",
            fontSize: "1.05rem",
            boxShadow: "0 8px 32px rgba(201,162,75,0.4)",
          }}
        >
          Teste grátis por 15 dias
        </a>

        <div className="mt-8 flex flex-wrap justify-center gap-6">
          {["Sem cartão", "Cancele quando quiser", "Dados seguros (LGPD)", "Suporte via WhatsApp"].map((f) => (
            <span key={f} className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(248,246,241,0.6)", fontFamily: "Inter" }}>
              <Check size={13} color={COLORS.gold} />
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    {
      title: "Produto",
      links: ["Como funciona", "Recursos", "Planos", "Changelog", "Status"],
    },
    {
      title: "Empresa",
      links: ["Sobre nós", "Blog", "Carreiras", "Imprensa", "Contato"],
    },
    {
      title: "Legal",
      links: ["Termos de uso", "Privacidade", "Cookies", "LGPD", "Segurança"],
    },
  ];

  return (
    <footer className="py-16 px-6 border-t" style={{ borderColor: COLORS.border }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Logo + desc */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: COLORS.green }}>
                <Sprout size={16} color={COLORS.gold} />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "Sora", color: COLORS.green }}>Rédeas</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.muted, fontFamily: "Inter" }}>
              Agente financeiro agrícola no WhatsApp. Controle total da sua fazenda, sem planilha.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: COLORS.green, fontFamily: "Sora" }}>
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm transition-colors hover:opacity-60" style={{ color: COLORS.muted, fontFamily: "Inter" }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: COLORS.border }}>
          <p className="text-xs" style={{ color: COLORS.muted, fontFamily: "Inter" }}>
            © 2025 Rédeas Tecnologia Agrícola Ltda. Todos os direitos reservados.
          </p>
          <p className="text-xs" style={{ color: COLORS.muted, fontFamily: "Inter" }}>
            Feito com cuidado para o produtor brasileiro 🌱
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      <Navbar />
      <HeroSection />
      <LogoBar />
      <HowItWorks />
      <ResourcesSection />
      <ForWhomSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
