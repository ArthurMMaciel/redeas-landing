import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ClipboardList,
  CreditCard,
  DollarSign,
  Home,
  LayoutDashboard,
  Leaf,
  ListChecks,
  Loader2,
  LogOut,
  MessageCircle,
  PiggyBank,
  Plus,
  QrCode,
  Save,
  ShieldCheck,
  Sprout,
  Trash2,
  UserCircle,
  WalletCards,
  X,
} from "lucide-react";
import { LoginModal } from "./components/auth/LoginModal";
import redeasLogo from "../assets/redeas-logo-transparent.png";
import "../styles/landing.css";

type PlanCode = "finance_basic" | "finance_safra";
type BillingCycle = "monthly" | "annual";
type PaymentMethod = "card" | "pix";
type PlatformTab = "dashboard" | "agenda" | "financeiro" | "planejamento";

type FormState = {
  planCode: PlanCode;
  name: string;
  phone: string;
  email: string;
  farmName: string;
  city: string;
  state: string;
  mainActivity: string;
};

type PayingUserSession = FormState & {
  userId: string;
  payerId: string;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  amountCents: number;
  paidAt: string;
};

type Plan = {
  code: PlanCode;
  name: string;
  price: string;
  monthlyPriceCents: number;
  annualInstallmentCents: number;
  annualTotalCents: number;
  anchor: string;
  description: string;
  featured?: boolean;
  includes: string[];
};

const plans: Plan[] = [
  {
    code: "finance_basic",
    name: "Essencial",
    anchor: "de R$ 39,90",
    price: "R$ 25,90",
    monthlyPriceCents: 2590,
    annualInstallmentCents: 2290,
    annualTotalCents: 27480,
    description: "Controle básico do dia a dia",
    includes: [
      "Registro de entradas e saídas pelo WhatsApp",
      "Contas a pagar e a receber",
      "Resumo financeiro mensal",
      "Acesso pelo celular",
    ],
  },
  {
    code: "finance_safra",
    name: "Completo",
    anchor: "de R$ 69,90",
    price: "R$ 47,90",
    monthlyPriceCents: 4790,
    annualInstallmentCents: 4390,
    annualTotalCents: 52680,
    description: "Gestão financeira com visão de decisão",
    featured: true,
    includes: [
      "Tudo do plano Essencial",
      "Relatório detalhado",
      "Análise por safra / atividade",
      "Alertas financeiros",
      "Planejamento e projeção",
      "Dashboard completo",
    ],
  },
];

const initialForm: FormState = {
  planCode: "finance_basic",
  name: "",
  phone: "",
  email: "",
  farmName: "",
  city: "",
  state: "",
  mainActivity: "",
};

const demoSession: PayingUserSession = {
  userId: "demo-user",
  payerId: "demo-payer",
  planCode: "finance_safra",
  billingCycle: "annual",
  paymentMethod: "card",
  amountCents: 52680,
  paidAt: new Date().toISOString(),
  name: "João Pereira",
  phone: "(65) 99999-1020",
  email: "joao@fazendasantaclara.com.br",
  farmName: "Fazenda Santa Clara",
  city: "Sorriso",
  state: "MT",
  mainActivity: "Soja e milho",
};

const sessionStorageKey = "redeas:paying-user";

const stateOptions = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

function formatMoney(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function getSupabaseConfig() {
  const env = import.meta.env as Record<string, string | undefined>;
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL;
  const publishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;

  return {
    url: url.replace(/\/$/, ""),
    publishableKey,
  };
}

function buildLocalSession(payload: FormState & { billingCycle: BillingCycle; paymentMethod: PaymentMethod; amountCents: number }): PayingUserSession {
  return {
    ...payload,
    userId: crypto.randomUUID(),
    payerId: crypto.randomUUID(),
    paidAt: new Date().toISOString(),
  };
}

function readStoredSession() {
  try {
    const stored = window.localStorage.getItem(sessionStorageKey);
    return stored ? (JSON.parse(stored) as PayingUserSession) : null;
  } catch {
    return null;
  }
}

function storeSession(session: PayingUserSession) {
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));
}

async function confirmFakePayment(payload: FormState & { billingCycle: BillingCycle; paymentMethod: PaymentMethod; amountCents: number }) {
  const supabase = getSupabaseConfig();
  if (!supabase) {
    return buildLocalSession(payload);
  }

  const response = await fetch(`${supabase.url}/functions/v1/checkouts`, {
    method: "POST",
    headers: {
      apikey: supabase.publishableKey,
      Authorization: `Bearer ${supabase.publishableKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      planCode: payload.planCode,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      farmName: payload.farmName,
      city: payload.city,
      state: payload.state,
      mainActivity: payload.mainActivity,
      billingCycle: payload.billingCycle,
      paymentMethod: payload.paymentMethod,
      amountCents: payload.amountCents,
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Não foi possível confirmar o pagamento. Confira os dados e tente novamente.");
  }

  return {
    ...payload,
    userId: result.data?.usuario?.id || crypto.randomUUID(),
    payerId: result.data?.usuarioPagante?.id || crypto.randomUUID(),
    paidAt: result.data?.usuarioPagante?.createdAt || new Date().toISOString(),
  } satisfies PayingUserSession;
}

function scrollToCheckout(planCode: PlanCode) {
  window.dispatchEvent(new CustomEvent("redeas:select-plan", { detail: planCode }));
  document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Brand() {
  return (
    <a href="/" className="brand" aria-label="Rédeas">
      <img src={redeasLogo} alt="Rédeas" className="brand-logo" />
    </a>
  );
}

function Header({ onLoginClick }: { onLoginClick?: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? "site-header scrolled" : "site-header"}>
      <div className="wrap nav">
        <Brand />
        <nav className="nav-links">
          <a href="#recursos">Recursos</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#planos">Planos</a>
          <a href="#duvidas">Dúvidas</a>
        </nav>
        <div className="nav-actions">
          {onLoginClick && (
            <button type="button" className="nav-login" onClick={onLoginClick}>
              Entrar
            </button>
          )}
          <a href="#planos" className="btn btn-cta">
            Começar agora
          </a>
        </div>
      </div>
    </header>
  );
}

function CheckIcon({ gold = false }: { gold?: boolean }) {
  return <Check size={17} strokeWidth={2.8} className={gold ? "icon-gold" : "icon-green"} />;
}

function Hero() {
  const conversationStep = useConversationDemo();

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow-h">
            <MessageCircle size={20} />
            IA no WhatsApp <b>feita pro agro</b>
          </span>
          <h1>
            Assuma o controle financeiro da sua <span className="gold">fazenda</span>.
          </h1>
          <p className="sub">
            O assessor que organiza o caixa e a agenda da sua propriedade, direto no WhatsApp. Você fala, o Rédeas anota.
            Sem planilha, sem app novo.
          </p>
          <div className="hero-cta">
            <a href="#planos" className="btn btn-cta">
              Quero organizar minha fazenda
            </a>
            <span className="mini">
              <ShieldCheck size={20} /> 7 dias de garantia
            </span>
          </div>
          <div className="proof">
            <div className="avatars">
              <span className="avatar-a">JP</span>
              <span className="avatar-b">MA</span>
              <span className="avatar-c">RC</span>
            </div>
            <p>Produtores de todo o Brasil já estão retomando as rédeas do próprio caixa.</p>
          </div>
        </div>

        <div className="phone-col">
          <FloatingCard
            className="f1"
            icon={<Bell size={20} />}
            title="Vencimento do Pronaf"
            text="Lembrete criado"
            visible={conversationStep >= 5}
          />
          <FloatingCard
            className="f2 danger"
            icon={<PiggyBank size={20} />}
            title="+ R$ 26.000"
            text="Venda de soja registrada"
            visible={conversationStep >= 3}
          />
          <FloatingCard
            className="f3"
            icon={<WalletCards size={20} />}
            title="R$ 42.350"
            text="Saldo da safra"
            visible={conversationStep >= 9}
          />
          <PhoneMock conversationStep={conversationStep} />
        </div>
      </div>
    </section>
  );
}

function useConversationDemo() {
  const [conversationStep, setConversationStep] = useState(0);

  useEffect(() => {
    const cycleDuration = 15500;
    const timeline = [
      [1, 500],
      [2, 1600],
      [3, 2700],
      [4, 3900],
      [5, 5100],
      [6, 6300],
      [7, 7500],
      [8, 8700],
      [9, 9900],
    ] as const;

    const timeouts: number[] = [];

    const runCycle = () => {
      setConversationStep(0);
      timeline.forEach(([step, delay]) => {
        timeouts.push(window.setTimeout(() => setConversationStep(step), delay));
      });
    };

    runCycle();
    const interval = window.setInterval(runCycle, cycleDuration);

    return () => {
      window.clearInterval(interval);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  return conversationStep;
}

function FloatingCard({
  className,
  icon,
  title,
  text,
  visible,
}: {
  className: string;
  icon: ReactNode;
  title: string;
  text: string;
  visible: boolean;
}) {
  return (
    <div className={`float chat-item ${visible ? "is-visible" : ""} ${className}`}>
      <div className="fi">{icon}</div>
      <div>
        <b>{title}</b>
        <small>{text}</small>
      </div>
    </div>
  );
}

function PhoneMock({ conversationStep }: { conversationStep: number }) {
  const chatClass = (showAt: number, baseClass: string) => `${baseClass} chat-item ${conversationStep >= showAt ? "is-visible" : ""}`;

  return (
    <div className="phone">
      <div className="notch" />
      <div className="screen">
        <div className="scr-top">
          <Sprout size={17} />
          <b>Rédeas</b>
          <span className="on">online</span>
        </div>
        <div className="scr-body">
          <div className={chatClass(1, "bub me")}>
            Vendi 200 sacas de soja a 130<small>09:12</small>
          </div>
          <div className={chatClass(3, "bub bot")}>
            Registrado! Entrada de <b>R$ 26.000</b> na safra atual.<small>09:12</small>
          </div>
          <div className={chatClass(4, "bub me")}>
            Me lembra do vencimento do Pronaf dia 15<small>09:13</small>
          </div>
          <div className={chatClass(6, "bub me")}>
            Quanto tenho a pagar esta semana?<small>09:13</small>
          </div>
          <div className={chatClass(7, "bub bot")}>
            A pagar esta semana: <b>R$ 9.640</b>.<small>09:13</small>
          </div>
          <div className="balance-thread">
            <div className={chatClass(8, "bub me")}>
              Quero saber o saldo da minha safra<small>09:14</small>
            </div>
            <div className={chatClass(9, "bub bot balance-answer")}>
              Saldo da safra: <b>R$ 42.350,00</b>
              <small>09:14</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ticker() {
  const items = ["Tudo pelo WhatsApp", "Anote por áudio", "Seus dados protegidos", "Feito por quem entende do agro", "Sem planilha", "Suporte humano"];
  return (
    <div className="ticker">
      <div className="track">
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`}>
            <span className="dot">●</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeatureSections() {
  return (
    <>
      <section id="recursos" className="section-cream">
        <div className="wrap feat-row">
          <FeatureCopy
            eyebrow="Controle financeiro"
            title={
              <>
                Anote seus gastos por <span className="gold">áudio ou texto</span>.
              </>
            }
            text="Mandou mensagem, tá anotado. O Rédeas entende o jeito que você fala e categoriza tudo sozinho."
            items={["Registre entradas e saídas em segundos", "Seus lançamentos já chegam categorizados", "Consulte o saldo da safra pelo WhatsApp"]}
          />
          <div className="feat-media">
            <ChatMock />
          </div>
        </div>
      </section>

      <section className="section-orange">
        <div className="wrap feat-row rev">
          <div className="feat-media">
            <DashboardMock />
          </div>
          <FeatureCopy
            eyebrow="Seu painel"
            title={
              <>
                Seu dinheiro organizado em <span className="gold">um só lugar</span>.
              </>
            }
            text="Tudo o que entrou, o que saiu e o que falta pagar num painel simples. Você sempre sabe como está a fazenda."
            items={["Veja seus gastos separados por categoria", "Saiba o que tem a pagar e a receber", "Descubra se a safra está dando lucro ou prejuízo"]}
          />
        </div>
      </section>

      <section className="section-beige">
        <div className="wrap feat-row">
          <FeatureCopy
            eyebrow="Agenda inteligente"
            title={
              <>
                Nunca mais perca um <span className="gold">vencimento</span>.
              </>
            }
            text="Financiamento, vacina, pagamento de diarista. Você fala uma vez e o Rédeas lembra na hora certa."
            items={["Lembretes de boletos e financiamentos", "Datas de manejo e vacinação do rebanho", "Resumo do dia direto no WhatsApp"]}
          />
          <div className="feat-media">
            <AgendaMock />
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCopy({
  eyebrow,
  title,
  text,
  items,
}: {
  eyebrow: string;
  title: ReactNode;
  text: string;
  items: string[];
}) {
  return (
    <div className="feat-copy">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="sec-title">{title}</h2>
      <p className="sec-sub">{text}</p>
      <ul className="feat-list">
        {items.map((item) => (
          <li key={item}>
            <CheckIcon />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MockTop({ title }: { title: string }) {
  return (
    <div className="mock-top">
      <Sprout size={16} />
      {title}
    </div>
  );
}

function ChatMock() {
  return (
    <div className="mock">
      <MockTop title="Rédeas" />
      <div className="mock-body mock-chat">
        <div className="bub me">
          Paguei 500 de diesel<small>07:40</small>
        </div>
        <div className="bub bot">
          Anotado! Saída de <b>R$ 500</b> em Combustível.<small>07:40</small>
        </div>
        <div className="bub me">
          Quanto gastei esse mês?<small>07:41</small>
        </div>
        <div className="bub bot">
          Você gastou <b>R$ 12.380</b>, maior parte em insumos (R$ 7.100).<small>07:41</small>
        </div>
      </div>
    </div>
  );
}

function DashboardMock() {
  const rows = [
    { icon: <WalletCards size={20} />, label: "Saldo da safra", value: "R$ 42.350", tone: "pos" },
    { icon: <PiggyBank size={20} />, label: "A receber", value: "R$ 18.900" },
    { icon: <Bell size={20} />, label: "A pagar", value: "R$ 9.640", tone: "neg" },
    { icon: <BarChart3 size={20} />, label: "Insumos (mês)", value: "R$ 7.100" },
  ];

  return (
    <div className="mock">
      <MockTop title="Painel do Rédeas" />
      <div className="mock-body">
        {rows.map((row) => (
          <div className="kv" key={row.label}>
            <span className="tag">
              <i>{row.icon}</i>
              {row.label}
            </span>
            <b className={row.tone}>{row.value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgendaMock() {
  const items = [
    ["15", "Jun", "Vencimento do Pronaf", "Financiamento • 09:00"],
    ["18", "Jun", "Vacina do gado", "Manejo • manhã"],
    ["20", "Jun", "Pagamento do diarista", "R$ 1.200"],
  ];

  return (
    <div className="mock">
      <MockTop title="Sua agenda" />
      <div className="mock-body">
        {items.map(([day, month, title, text]) => (
          <div className="agenda-it" key={title}>
            <div className="d">
              <b>{day}</b>
              <span>{month}</span>
            </div>
            <div>
              <p>{title}</p>
              <small>{text}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UseYourWay() {
  const chips = [
    { icon: <WalletCards size={20} />, text: "Registrar um gasto" },
    { icon: <PiggyBank size={20} />, text: "Lançar uma venda" },
    { icon: <BarChart3 size={20} />, text: "Consultar o saldo" },
    { icon: <Bell size={20} />, text: "Criar um lembrete" },
    { icon: <CalendarDays size={20} />, text: "Ver a agenda da semana" },
    { icon: <MessageCircle size={20} />, text: "Perguntar qualquer coisa" },
  ];

  return (
    <section className="way">
      <div className="wrap center">
        <span className="eyebrow">Do seu jeito</span>
        <h2 className="sec-title">
          Não tem um jeito certo de usar. <span className="gold">Tem o seu.</span>
        </h2>
        <p className="sec-sub">É só falar, do jeito do campo. Com um áudio, você pode:</p>
        <div className="chips-grid">
          {chips.map((chip) => (
            <div className="chip-b" key={chip.text}>
              {chip.icon}
              {chip.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const cards = [
    { icon: <MessageCircle size={22} />, title: "Controle pelo WhatsApp", text: "Lance contas e saldos em segundos, do jeito que você fala." },
    { icon: <WalletCards size={22} />, title: "Clareza do seu caixa", text: "Saiba exatamente o que tem a pagar, a receber e o saldo real." },
    { icon: <BarChart3 size={22} />, title: "Relatórios que decidem", text: "Dados organizados pra você ver o que dá lucro ou prejuízo." },
    { icon: <Leaf size={22} />, title: "Feito para o agro", text: "Entendemos a fazenda porque construímos com quem vive nela." },
  ];

  return (
    <section className="section-cream">
      <div className="wrap center">
        <span className="eyebrow">Por que produtores escolhem</span>
        <h2 className="sec-title">
          Por que escolher o <span className="gold">Rédeas</span>
        </h2>
      </div>
      <div className="wrap">
        <div className="cards4">
          {cards.map((card) => (
            <div className="card" key={card.title}>
              <div className="ic">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["1", "Você envia pelo WhatsApp", "Fala o que entrou ou saiu. Ex: “Paguei 500 de diesel”."],
    ["2", "O Rédeas organiza tudo", "O agente registra, categoriza e cuida do resto."],
    ["3", "Você recebe clareza", "Dados organizados pra você tomar as melhores decisões."],
  ];

  return (
    <section className="how" id="como-funciona">
      <div className="wrap center">
        <span className="eyebrow">Simples assim</span>
        <h2 className="sec-title">Como funciona</h2>
      </div>
      <div className="wrap">
        <div className="steps">
          {steps.map(([number, title, text]) => (
            <div className="step" key={number}>
              <div className="n">{number}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section id="planos" className="section-beige">
      <div className="wrap center">
        <span className="eyebrow">Planos</span>
        <h2 className="sec-title">Escolha o plano ideal para sua fazenda</h2>
        <p className="sec-sub">Do básico ao completo, você escolhe até onde quer chegar.</p>
      </div>
      <div className="wrap">
        <div className="plans-wrap">
          {plans.map((plan) => (
            <PlanCard key={plan.code} plan={plan} />
          ))}
          <div className="quote">
            <div className="mark">“</div>
            <p>Hoje eu sei o que tenho que pagar, quanto vou receber e quanto sobra no final da safra. O Rédeas me deu tranquilidade pra crescer.</p>
            <div className="who">
              <span>JP</span>
              <div>
                <b>João P.</b>
                <small>Produtor rural — Mato Grosso</small>
              </div>
            </div>
          </div>
        </div>
        <div className="guarantee">
          <span>
            <ShieldCheck size={20} /> 7 dias de garantia
          </span>
          <span>
            <CreditCard size={20} /> Compra segura
          </span>
          <span>
            <MessageCircle size={20} /> Suporte humano
          </span>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className={plan.featured ? "plan feat" : "plan"}>
      {plan.featured && <span className="badge">MAIS ESCOLHIDO</span>}
      <h3>{plan.name}</h3>
      <p className="pdesc">{plan.description}</p>
      <div className="anchor">{plan.anchor}</div>
      <div className="price">
        {plan.price}
        <small> /mês</small>
      </div>
      <ul>
        {plan.includes.map((item) => (
          <li key={item}>
            <CheckIcon gold={plan.featured} />
            {item}
          </li>
        ))}
      </ul>
      <button type="button" className={plan.featured ? "btn btn-cta" : "btn btn-ghost"} onClick={() => scrollToCheckout(plan.code)}>
        Assinar plano {plan.name}
      </button>
    </div>
  );
}

function CheckoutForm({ onPaymentConfirmed }: { onPaymentConfirmed: (session: PayingUserSession) => void }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [billingCycle, setBillingCycle] = useState<BillingCycle | "">("");

  useEffect(() => {
    const listener = (event: Event) => {
      const planCode = (event as CustomEvent<PlanCode>).detail;
      setForm((current) => ({ ...current, planCode }));
      setTimeout(() => formRef.current?.querySelector<HTMLInputElement>("#name")?.focus(), 350);
    };
    window.addEventListener("redeas:select-plan", listener);
    return () => window.removeEventListener("redeas:select-plan", listener);
  }, []);

  const selectedPlan = plans.find((plan) => plan.code === form.planCode) || plans[0];
  const selectedAmountCents = billingCycle === "monthly" ? selectedPlan.monthlyPriceCents : selectedPlan.annualTotalCents;

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const required: Array<[keyof FormState, string]> = [
      ["name", "Informe o nome completo."],
      ["phone", "Informe o telefone WhatsApp."],
      ["email", "Informe o email."],
      ["farmName", "Informe o nome da fazenda."],
      ["city", "Informe a cidade."],
      ["state", "Informe a UF."],
      ["mainActivity", "Informe a atividade ou cultura principal."],
    ];

    for (const [field, message] of required) {
      if (!String(form[field]).trim()) return message;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Informe um email válido.";
    }

    return "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setPaymentOpen(true);
  }

  async function handleConfirmPayment() {
    setError("");
    if (!billingCycle) {
      setError("Selecione o ciclo da assinatura para efetuar o pagamento.");
      return;
    }

    setLoading(true);
    try {
      const session = await confirmFakePayment({
        planCode: form.planCode,
        billingCycle,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        farmName: form.farmName.trim(),
        city: form.city.trim(),
        state: form.state,
        mainActivity: form.mainActivity.trim(),
        paymentMethod,
        amountCents: selectedAmountCents,
      });

      setPaymentOpen(false);
      onPaymentConfirmed(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar o checkout. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="checkout" className="checkout-section">
      <div className="wrap checkout-grid">
        <div>
          <p className="eyebrow">Assinatura</p>
          <h2 className="sec-title">Preencha os dados antes de ir para o pagamento</h2>
          <p className="sec-sub">
            Use o mesmo número de WhatsApp que vai conversar com o agente. Depois do pagamento aprovado, sua assinatura é ativada e o contato é liberado.
          </p>

          <div className="selected-plan">
            <p>Plano escolhido</p>
            <h3>{selectedPlan.name}</h3>
            <strong>
              {selectedPlan.price}
              <small> /mês</small>
            </strong>
            <span>{selectedPlan.description}</span>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="checkout-form">
          <label className="field field-full">
            <span>Plano escolhido</span>
            <select value={form.planCode} onChange={(event) => updateField("planCode", event.target.value as PlanCode)}>
              {plans.map((plan) => (
                <option key={plan.code} value={plan.code}>
                  {plan.name} - {plan.price}/mês
                </option>
              ))}
            </select>
          </label>

          <Input label="Nome completo" id="name" value={form.name} onChange={(value) => updateField("name", value)} autoComplete="name" />
          <Input label="Telefone WhatsApp" value={form.phone} onChange={(value) => updateField("phone", value)} placeholder="(44) 99999-9999" autoComplete="tel" />
          <Input label="Email" value={form.email} onChange={(value) => updateField("email", value)} type="email" autoComplete="email" />
          <Input label="Nome da fazenda" value={form.farmName} onChange={(value) => updateField("farmName", value)} />
          <Input label="Cidade" value={form.city} onChange={(value) => updateField("city", value)} />

          <label className="field">
            <span>UF</span>
            <select value={form.state} onChange={(event) => updateField("state", event.target.value)}>
              <option value="">Selecione</option>
              {stateOptions.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>

          <Input
            label="Atividade principal/cultura principal"
            value={form.mainActivity}
            onChange={(value) => updateField("mainActivity", value)}
            placeholder="soja, leite, café..."
            className="field-full"
          />

          {error && <div className="form-error">{error}</div>}

          <button type="submit" disabled={loading} className="btn checkout-button">
            {loading ? (
              <>
                <Loader2 className="spin" size={19} />
                Criando checkout...
              </>
            ) : (
              <>
                Assinar plano
                <ArrowRight size={19} />
              </>
            )}
          </button>

          <p className="checkout-note">O acesso ao WhatsApp só é liberado após a confirmação do pagamento.</p>
        </form>
      </div>
      <PaymentModal
        open={paymentOpen}
        plan={selectedPlan}
        form={form}
        paymentMethod={paymentMethod}
        billingCycle={billingCycle}
        loading={loading}
        onPaymentMethodChange={setPaymentMethod}
        onBillingCycleChange={setBillingCycle}
        onClose={() => {
          if (!loading) setPaymentOpen(false);
        }}
        onConfirm={handleConfirmPayment}
      />
    </section>
  );
}

function PaymentModal({
  open,
  plan,
  form,
  paymentMethod,
  billingCycle,
  loading,
  onPaymentMethodChange,
  onBillingCycleChange,
  onClose,
  onConfirm,
}: {
  open: boolean;
  plan: Plan;
  form: FormState;
  paymentMethod: PaymentMethod;
  billingCycle: BillingCycle | "";
  loading: boolean;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onBillingCycleChange: (cycle: BillingCycle | "") => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  const cycleOptions =
    paymentMethod === "pix"
      ? [
          { value: "monthly" as const, label: `Mensal - ${formatMoney(plan.monthlyPriceCents)}` },
          { value: "annual" as const, label: `Anual - ${formatMoney(plan.annualTotalCents)}` },
        ]
      : [
          { value: "monthly" as const, label: `Mensal - ${formatMoney(plan.monthlyPriceCents)}` },
          { value: "annual" as const, label: `Anual - 12x ${formatMoney(plan.annualInstallmentCents)} (${formatMoney(plan.annualTotalCents)})` },
        ];

  return (
    <div className="pay-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="pay-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="pay-modal-close" aria-label="Fechar pagamento" onClick={onClose} disabled={loading}>
          <X size={20} />
        </button>

        <div className="pay-modal-head">
          <p className="eyebrow">Pagamento</p>
          <h2 id="payment-title">Efetuar pagamento</h2>
        </div>

        <div className="pay-summary">
          <div>
            <small>Nome completo</small>
            <strong>{form.name}</strong>
          </div>
          <div>
            <small>Email</small>
            <strong>{form.email}</strong>
          </div>
          <div>
            <small>Telefone WhatsApp</small>
            <strong>{form.phone}</strong>
          </div>
        </div>

        <div className="pay-section">
          <h3>Forma de pagamento</h3>
          <div className="payment-options two">
            <button
              type="button"
              className={paymentMethod === "card" ? "payment-option active" : "payment-option"}
              onClick={() => {
                onPaymentMethodChange("card");
                onBillingCycleChange("");
              }}
            >
              <CreditCard size={21} />
              <span>Cartão de crédito</span>
              <small>Validação fake aprovada na hora</small>
            </button>
            <button
              type="button"
              className={paymentMethod === "pix" ? "payment-option active" : "payment-option"}
              onClick={() => {
                onPaymentMethodChange("pix");
                onBillingCycleChange("");
              }}
            >
              <QrCode size={21} />
              <span>Pix</span>
              <small>Validação fake aprovada na hora</small>
            </button>
          </div>
        </div>

        <label className="payment-cycle-field">
          <span>{paymentMethod === "pix" ? "Escolha a cobrança Pix" : "Escolha a cobrança no cartão"}</span>
          <select value={billingCycle} onChange={(event) => onBillingCycleChange(event.target.value as BillingCycle | "")}>
            <option value="">Selecione uma opção</option>
            {cycleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="btn checkout-button pay-confirm" onClick={onConfirm} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="spin" size={19} />
              Criando checkout...
            </>
          ) : (
            <>
              Efetuar pagamento
              <ArrowRight size={19} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  id,
  type = "text",
  placeholder,
  autoComplete,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete={autoComplete} />
    </label>
  );
}

function Faq() {
  const questions = [
    ["Preciso instalar algum aplicativo?", "Não. O Rédeas funciona inteiramente pelo WhatsApp, que você já usa todo dia. É só mandar mensagem ou áudio."],
    ["Não entendo de tecnologia. Vou conseguir usar?", "Se você usa WhatsApp, você usa o Rédeas. É só conversar, do jeito que você fala. Sem planilha, sem painel complicado."],
    ["Funciona pra qualquer tipo de produção?", "Sim. Lavoura, pecuária, pequena ou média propriedade, o Rédeas se adapta ao seu jeito de tocar a fazenda."],
    ["Meus dados estão seguros?", "Sim. Seus dados são protegidos e não são compartilhados com terceiros, seguindo a LGPD."],
    ["E se eu não gostar?", "Você tem 7 dias de garantia. Se sentir que não é pra você, devolvemos 100% do valor, sem burocracia."],
  ];

  return (
    <section className="faq" id="duvidas">
      <div className="wrap center">
        <span className="eyebrow">Tire suas dúvidas</span>
        <h2 className="sec-title">Perguntas frequentes</h2>
      </div>
      <div className="wrap">
        <div className="faq-list">
          {questions.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="cta-band">
      <div className="wrap">
        <h2>Pronto pra assumir as rédeas da sua fazenda?</h2>
        <p>Comece hoje a organizar o caixa e a agenda da sua propriedade direto no WhatsApp.</p>
        <a href="#planos" className="btn btn-cta">
          Quero começar agora
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-brand">
          <Brand />
        </div>
        <div className="tag">Assuma o controle do seu agronegócio</div>
        <small>© 2026 Rédeas. Todos os direitos reservados.</small>
      </div>
    </footer>
  );
}

function PlatformPage({ session, onLogout }: { session: PayingUserSession; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<PlatformTab>("dashboard");
  const [agenda, setAgenda] = useState([
    { id: "a1", date: "2026-07-02", title: "Pagamento do arrendamento", details: "R$ 8.400 - confirmar no banco" },
    { id: "a2", date: "2026-07-05", title: "Compra de insumos", details: "Cotar defensivos da safra de milho" },
    { id: "a3", date: "2026-07-10", title: "Revisão do trator", details: "Oficina agendada para o período da manhã" },
  ]);
  const [financeiro, setFinanceiro] = useState([
    { id: "f1", type: "receita", description: "Venda de soja", amount: "26000", category: "Receita" },
    { id: "f2", type: "despesa", description: "Diesel", amount: "1250", category: "Combustível" },
    { id: "f3", type: "despesa", description: "Fertilizante", amount: "7100", category: "Insumos" },
  ]);
  const [planejamento, setPlanejamento] = useState([
    { id: "p1", goal: "Meta de faturamento da safra", value: "273750" },
    { id: "p2", goal: "Limite mensal de gastos", value: "18000" },
    { id: "p3", goal: "Reserva para manutenção", value: "9500" },
  ]);

  const plan = plans.find((item) => item.code === session.planCode) || plans[0];
  const canPlan = session.planCode === "finance_safra";
  const receita = financeiro.filter((item) => item.type === "receita").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const despesa = financeiro.filter((item) => item.type === "despesa").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const saldo = receita - despesa;
  const tabs: Array<{ id: PlatformTab; label: string; icon: ReactNode; disabled?: boolean }> = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "agenda", label: "Agenda", icon: <CalendarDays size={18} /> },
    { id: "financeiro", label: "Financeiro", icon: <DollarSign size={18} /> },
    { id: "planejamento", label: "Planejamento", icon: <ListChecks size={18} />, disabled: !canPlan },
  ];

  function addAgendaItem() {
    setAgenda((current) => [...current, { id: crypto.randomUUID(), date: "2026-07-15", title: "Novo compromisso", details: "Detalhes do compromisso" }]);
  }

  function addFinanceItem() {
    setFinanceiro((current) => [...current, { id: crypto.randomUUID(), type: "despesa", description: "Novo lançamento", amount: "0", category: "Geral" }]);
  }

  function addPlanningItem() {
    setPlanejamento((current) => [...current, { id: crypto.randomUUID(), goal: "Nova meta", value: "0" }]);
  }

  return (
    <main className="platform-shell">
      <aside className="platform-sidebar">
        <Brand />
        <div className="platform-user">
          <UserCircle size={36} />
          <div>
            <strong>{session.name}</strong>
            <span>{plan.name}</span>
          </div>
        </div>
        <nav className="platform-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "active" : ""}
              disabled={tab.disabled}
              onClick={() => setActiveTab(tab.id)}
              title={tab.disabled ? "Disponível no plano Completo" : tab.label}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
        <button type="button" className="platform-logout" onClick={onLogout}>
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <section className="platform-main">
        <header className="platform-topbar">
          <div>
            <span>{session.farmName}</span>
            <h1>{tabs.find((tab) => tab.id === activeTab)?.label}</h1>
          </div>
          <a href="/" className="platform-home">
            <Home size={18} />
            Landing
          </a>
        </header>

        {activeTab === "dashboard" && (
          <div className="platform-grid">
            <MetricCard icon={<WalletCards size={20} />} label="Saldo atual" value={formatMoney(saldo * 100)} tone={saldo >= 0 ? "positive" : "negative"} />
            <MetricCard icon={<PiggyBank size={20} />} label="Receitas" value={formatMoney(receita * 100)} tone="positive" />
            <MetricCard icon={<CreditCard size={20} />} label="Despesas" value={formatMoney(despesa * 100)} tone="negative" />
            <MetricCard icon={<ClipboardList size={20} />} label="Agenda" value={`${agenda.length} itens`} />
            <div className="platform-panel platform-wide">
              <h2>Resumo do agente</h2>
              <p>
                O agente registrou {financeiro.length} lançamentos e encontrou maior concentração de despesas em insumos e combustível. A próxima
                ação recomendada é revisar o limite mensal antes da nova compra de defensivos.
              </p>
            </div>
          </div>
        )}

        {activeTab === "agenda" && (
          <EditableSection title="Agenda da fazenda" onAdd={addAgendaItem}>
            {agenda.map((item) => (
              <div className="edit-row agenda-edit-row" key={item.id}>
                <input value={item.date} type="date" onChange={(event) => setAgenda((current) => current.map((row) => (row.id === item.id ? { ...row, date: event.target.value } : row)))} />
                <input value={item.title} onChange={(event) => setAgenda((current) => current.map((row) => (row.id === item.id ? { ...row, title: event.target.value } : row)))} />
                <input value={item.details} onChange={(event) => setAgenda((current) => current.map((row) => (row.id === item.id ? { ...row, details: event.target.value } : row)))} />
                <button type="button" onClick={() => setAgenda((current) => current.filter((row) => row.id !== item.id))} aria-label="Remover compromisso">
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </EditableSection>
        )}

        {activeTab === "financeiro" && (
          <EditableSection title="Lançamentos financeiros" onAdd={addFinanceItem}>
            {financeiro.map((item) => (
              <div className="edit-row finance-edit-row" key={item.id}>
                <select value={item.type} onChange={(event) => setFinanceiro((current) => current.map((row) => (row.id === item.id ? { ...row, type: event.target.value } : row)))}>
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
                <input value={item.description} onChange={(event) => setFinanceiro((current) => current.map((row) => (row.id === item.id ? { ...row, description: event.target.value } : row)))} />
                <input value={item.category} onChange={(event) => setFinanceiro((current) => current.map((row) => (row.id === item.id ? { ...row, category: event.target.value } : row)))} />
                <input value={item.amount} type="number" min="0" onChange={(event) => setFinanceiro((current) => current.map((row) => (row.id === item.id ? { ...row, amount: event.target.value } : row)))} />
                <button type="button" onClick={() => setFinanceiro((current) => current.filter((row) => row.id !== item.id))} aria-label="Remover lançamento">
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </EditableSection>
        )}

        {activeTab === "planejamento" && canPlan && (
          <EditableSection title="Planejamento da safra" onAdd={addPlanningItem}>
            {planejamento.map((item) => (
              <div className="edit-row planning-edit-row" key={item.id}>
                <input value={item.goal} onChange={(event) => setPlanejamento((current) => current.map((row) => (row.id === item.id ? { ...row, goal: event.target.value } : row)))} />
                <input value={item.value} type="number" min="0" onChange={(event) => setPlanejamento((current) => current.map((row) => (row.id === item.id ? { ...row, value: event.target.value } : row)))} />
                <button type="button" onClick={() => setPlanejamento((current) => current.filter((row) => row.id !== item.id))} aria-label="Remover meta">
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </EditableSection>
        )}
      </section>
    </main>
  );
}

function MetricCard({ icon, label, value, tone = "" }: { icon: ReactNode; label: string; value: string; tone?: string }) {
  return (
    <div className={`metric-card ${tone}`}>
      <span>{icon}</span>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function EditableSection({ title, onAdd, children }: { title: string; onAdd: () => void; children: ReactNode }) {
  return (
    <div className="platform-panel">
      <div className="edit-head">
        <h2>{title}</h2>
        <div>
          <button type="button" className="platform-action secondary">
            <Save size={17} />
            Salvar
          </button>
          <button type="button" className="platform-action" onClick={onAdd}>
            <Plus size={17} />
            Adicionar
          </button>
        </div>
      </div>
      <div className="edit-list">{children}</div>
    </div>
  );
}

function PaymentStatus({ type }: { type: "approved" | "cancelled" }) {
  const approved = type === "approved";

  return (
    <main className="payment-page">
      <Header />
      <section className="wrap payment-status">
        <div className="payment-card">
          <div className={approved ? "payment-icon ok" : "payment-icon warn"}>{approved ? <Check size={25} /> : <CreditCard size={25} />}</div>
          <h1>{approved ? "Pagamento recebido" : "Pagamento cancelado"}</h1>
          <p>
            {approved
              ? "Recebemos o retorno do pagamento. O WhatsApp será liberado após a confirmação da aprovação pela operadora."
              : "O checkout não foi concluído. Você pode voltar para a landing, conferir os dados e tentar novamente."}
          </p>
          <a href="/" className="btn">
            Voltar para a landing
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}

function LandingPage({ onPaymentConfirmed, onDemoLogin }: { onPaymentConfirmed: (session: PayingUserSession) => void; onDemoLogin: () => void }) {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <main>
      <Header onLoginClick={() => setLoginOpen(true)} />
      <Hero />
      <Ticker />
      <FeatureSections />
      <UseYourWay />
      <Benefits />
      <HowItWorks />
      <Plans />
      <CheckoutForm onPaymentConfirmed={onPaymentConfirmed} />
      <Faq />
      <CtaBand />
      <Footer />
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={() => {
          setLoginOpen(false);
          onDemoLogin();
        }}
      />
    </main>
  );
}

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/$/, "") || "/");
  const [toast, setToast] = useState("");
  const [session, setSession] = useState<PayingUserSession | null>(() => readStoredSession());

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname.replace(/\/$/, "") || "/");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(to: string) {
    window.history.pushState({}, "", to);
    setPath(to.replace(/\/$/, "") || "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 4200);
  }

  function handlePaymentConfirmed(nextSession: PayingUserSession) {
    storeSession(nextSession);
    setSession(nextSession);
    showToast("Pagamento confirmado! Nosso agente entrará em contato com você em instantes");
    window.setTimeout(() => navigate("/plataforma"), 1100);
  }

  function handleDemoLogin() {
    const nextSession = readStoredSession() || demoSession;
    storeSession(nextSession);
    setSession(nextSession);
    navigate("/plataforma");
  }

  function handleLogout() {
    window.localStorage.removeItem(sessionStorageKey);
    setSession(null);
    navigate("/");
  }

  if (path === "/pagamento/aprovado") {
    return <PaymentStatus type="approved" />;
  }

  if (path === "/pagamento/cancelado") {
    return <PaymentStatus type="cancelled" />;
  }

  if (path === "/plataforma") {
    return (
      <>
        <PlatformPage session={session || demoSession} onLogout={handleLogout} />
        {toast && <Toast message={toast} />}
      </>
    );
  }

  return (
    <>
      <LandingPage onPaymentConfirmed={handlePaymentConfirmed} onDemoLogin={handleDemoLogin} />
      {toast && <Toast message={toast} />}
    </>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="app-toast" role="status">
      <Check size={19} />
      {message}
    </div>
  );
}
