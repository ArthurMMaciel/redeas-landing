import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  Check,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sprout,
  Tractor,
  WalletCards,
} from "lucide-react";

type PlanCode = "finance_basic" | "finance_safra";

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

type CheckoutLeadPayload = FormState & {
  source: string;
};

const plans: Array<{
  code: PlanCode;
  name: string;
  price: string;
  description: string;
  includes: string[];
  excludes?: string;
}> = [
  {
    code: "finance_basic",
    name: "Controle Financeiro",
    price: "R$ 25,90/mês",
    description: "Para começar o controle da fazenda pelo WhatsApp.",
    includes: ["Controle financeiro pelo WhatsApp", "Agenda agro", "Cadastro da fazenda no pagamento"],
    excludes: "Não inclui planejamento de safra.",
  },
  {
    code: "finance_safra",
    name: "Financeiro + Safra",
    price: "R$ 65,00/mês",
    description: "Para quem quer organizar dinheiro, agenda e planejamento.",
    includes: ["Controle financeiro pelo WhatsApp", "Agenda agro", "Planejamento de safra"],
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

function getApiBaseUrl() {
  const env = import.meta.env as Record<string, string | undefined>;
  return (
    env.NEXT_PUBLIC_API_BASE_URL ||
    env.VITE_API_BASE_URL ||
    "https://api.redeas.online"
  ).replace(/\/$/, "");
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

async function saveCheckoutLead(payload: CheckoutLeadPayload) {
  const supabase = getSupabaseConfig();
  if (!supabase) return;

  await fetch(`${supabase.url}/rest/v1/checkout_leads`, {
    method: "POST",
    headers: {
      apikey: supabase.publishableKey,
      Authorization: `Bearer ${supabase.publishableKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      plan_code: payload.planCode,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      farm_name: payload.farmName,
      city: payload.city,
      state: payload.state,
      main_activity: payload.mainActivity,
      source: payload.source,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Não foi possível registrar o cadastro inicial.");
    }
  });
}

function scrollToCheckout(planCode: PlanCode) {
  window.dispatchEvent(new CustomEvent("redeas:select-plan", { detail: planCode }));
  document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Brand() {
  return (
    <a href="/" className="flex items-center gap-2" aria-label="Redeas">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#21442e] text-[#f3c85d]">
        <Sprout size={19} />
      </span>
      <span className="text-xl font-bold text-[#21442e]">Redeas</span>
    </a>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d8ddcf] bg-[#fbfaf6]/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Brand />
        <nav className="hidden items-center gap-7 text-sm font-medium text-[#4b5d45] md:flex">
          <a href="#como-funciona">Como funciona</a>
          <a href="#planos">Planos</a>
          <a href="#checkout">Assinar</a>
        </nav>
        <button
          type="button"
          onClick={() => scrollToCheckout("finance_basic")}
          className="inline-flex items-center gap-2 rounded-lg bg-[#21442e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#183523]"
        >
          Assinar
          <ArrowRight size={16} />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf6]">
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[#eef0e5]" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-10 px-5 py-14 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-[#d7c071] bg-[#fff6d8] px-3 py-2 text-sm font-semibold text-[#5d5121]">
            <MessageCircle size={16} />
            Agente de WhatsApp para controle financeiro e agenda agro
          </div>
          <h1 className="text-4xl font-bold leading-tight text-[#183523] sm:text-5xl lg:text-6xl">
            Redeas
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#4f5c49]">
            Cadastre sua fazenda pela landing page, escolha o plano e siga para o pagamento. Depois da confirmação, o agente é liberado no WhatsApp do número cadastrado.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => scrollToCheckout("finance_basic")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d8b24b] px-6 py-3.5 font-bold text-[#1d261b] shadow-sm transition hover:bg-[#caa13e]"
            >
              Assinar Controle Financeiro
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollToCheckout("finance_safra")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#b8c2af] px-6 py-3.5 font-semibold text-[#21442e] transition hover:bg-white"
            >
              Ver plano com Safra
            </button>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 text-sm text-[#586653] sm:grid-cols-3">
            <span className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-[#21442e]" />
              Sem usuário no frontend
            </span>
            <span className="flex items-center gap-2">
              <CreditCard size={17} className="text-[#21442e]" />
              Acesso após aprovação
            </span>
            <span className="flex items-center gap-2">
              <Phone size={17} className="text-[#21442e]" />
              Telefone é o identificador
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <div className="overflow-hidden rounded-lg border border-[#d8ddcf] bg-white shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
              alt="Plantação agrícola vista do alto"
              className="h-64 w-full object-cover sm:h-80"
            />
            <div className="grid gap-0 border-t border-[#e3e6db] sm:grid-cols-3">
              {[
                ["WhatsApp", "Registre gastos por mensagem"],
                ["Agenda", "Não perca tarefas da fazenda"],
                ["Safra", "Planeje quando o plano incluir"],
              ].map(([title, text]) => (
                <div key={title} className="border-b border-[#e3e6db] p-5 sm:border-b-0 sm:border-r last:sm:border-r-0">
                  <p className="font-bold text-[#21442e]">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#5f6c59]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: ClipboardCheck,
      title: "Preencha o cadastro",
      text: "Informe seus dados, fazenda, cidade, UF, cultura principal e o telefone que vai conversar com o agente.",
    },
    {
      icon: CreditCard,
      title: "Pague pelo checkout",
      text: "A landing chama a API para criar o checkout. Nenhum usuário é criado diretamente no frontend.",
    },
    {
      icon: MessageCircle,
      title: "Receba a liberação",
      text: 'Após aprovação, o backend ativa a assinatura e envia: "Olá, sou rédeas, seu agente de controle financeiro e agenda agro."',
    },
  ];

  return (
    <section id="como-funciona" className="bg-[#eef0e5] px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[#8b7330]">Como funciona</p>
          <h2 className="mt-3 text-3xl font-bold text-[#183523] sm:text-4xl">
            O cadastro começa aqui. O WhatsApp vem depois do pagamento aprovado.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="rounded-lg border border-[#d8ddcf] bg-white p-6">
              <step.icon className="text-[#21442e]" size={28} />
              <h3 className="mt-5 text-xl font-bold text-[#183523]">{step.title}</h3>
              <p className="mt-3 leading-7 text-[#5d6b57]">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section id="planos" className="bg-[#fbfaf6] px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#8b7330]">Planos</p>
            <h2 className="mt-3 text-3xl font-bold text-[#183523] sm:text-4xl">
              Escolha o plano antes do pagamento
            </h2>
          </div>
          <p className="max-w-lg leading-7 text-[#5d6b57]">
            O plano escolhido é enviado para a API como `planCode`. Você pode começar no financeiro ou incluir planejamento de safra.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <div
              key={plan.code}
              className={`rounded-lg border p-7 ${
                index === 0
                  ? "border-[#d8b24b] bg-[#fffdf4] shadow-sm"
                  : "border-[#d8ddcf] bg-white"
              }`}
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-semibold text-[#7b6b2d]">{plan.code}</p>
                  <h3 className="mt-2 text-2xl font-bold text-[#183523]">{plan.name}</h3>
                  <p className="mt-3 text-[#5d6b57]">{plan.description}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-3xl font-bold text-[#21442e]">{plan.price}</p>
                </div>
              </div>
              <ul className="mt-7 space-y-3">
                {plan.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-[#30442c]">
                    <Check className="mt-0.5 shrink-0 text-[#427a4c]" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {plan.excludes && (
                <p className="mt-5 rounded-lg bg-[#f3efe1] px-4 py-3 text-sm font-medium text-[#655a36]">
                  {plan.excludes}
                </p>
              )}
              <button
                type="button"
                onClick={() => scrollToCheckout(plan.code)}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#21442e] px-5 py-3.5 font-bold text-white transition hover:bg-[#183523]"
              >
                Assinar este plano
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: WalletCards, title: "Controle financeiro", text: "Organize despesas e receitas da fazenda pelo WhatsApp." },
    { icon: CalendarClock, title: "Agenda agro", text: "Registre compromissos e atividades do dia a dia rural." },
    { icon: Tractor, title: "Rotina de campo", text: "Feito para produtor, consultor agro e pequenas fazendas." },
    { icon: MapPin, title: "Fazenda vinculada", text: "A API cria a fazenda após o pagamento aprovado." },
  ];

  return (
    <section className="bg-[#21442e] px-5 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#d8b24b]">Para o agro real</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Menos sistema, mais conversa no canal que o produtor já usa.
            </h2>
            <p className="mt-5 leading-7 text-[#dce8d8]">
              O Redeas não substitui o pagamento nem cria acesso antes da aprovação. Ele recebe a liberação do backend e começa no WhatsApp certo.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item.title} className="rounded-lg border border-white/14 bg-white/8 p-5">
                <item.icon className="text-[#d8b24b]" size={25} />
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 leading-6 text-[#dce8d8]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckoutForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await saveCheckoutLead({
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        farmName: form.farmName.trim(),
        city: form.city.trim(),
        mainActivity: form.mainActivity.trim(),
        source: "landing_checkout",
      }).catch((leadError) => {
        console.warn(leadError);
      });

      const response = await fetch(`${getApiBaseUrl()}/api/v1/checkouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planCode: form.planCode,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          farmName: form.farmName.trim(),
          city: form.city.trim(),
          state: form.state,
          mainActivity: form.mainActivity.trim(),
        }),
      });

      const result = await response.json().catch(() => null);
      const checkoutUrl = result?.data?.checkoutUrl;

      if (!response.ok || !result?.success || !checkoutUrl) {
        throw new Error(result?.message || "Não foi possível criar o checkout. Confira os dados e tente novamente.");
      }

      window.location.assign(checkoutUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar o checkout. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="checkout" className="bg-[#eef0e5] px-5 py-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#8b7330]">Assinatura</p>
          <h2 className="mt-3 text-3xl font-bold text-[#183523] sm:text-4xl">
            Preencha os dados antes de ir para o pagamento
          </h2>
          <p className="mt-5 leading-7 text-[#5d6b57]">
            Use o mesmo número de WhatsApp que vai conversar com o agente. Depois do pagamento aprovado, o backend cria o usuário, ativa a assinatura e libera o contato.
          </p>

          <div className="mt-8 rounded-lg border border-[#d8ddcf] bg-white p-5">
            <p className="text-sm font-semibold text-[#6c5d27]">Plano escolhido</p>
            <h3 className="mt-2 text-2xl font-bold text-[#21442e]">{selectedPlan.name}</h3>
            <p className="mt-1 text-xl font-bold text-[#183523]">{selectedPlan.price}</p>
            <p className="mt-3 leading-6 text-[#5d6b57]">{selectedPlan.description}</p>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="rounded-lg border border-[#d8ddcf] bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-sm font-semibold text-[#30442c]">Plano escolhido</span>
              <select
                value={form.planCode}
                onChange={(event) => updateField("planCode", event.target.value as PlanCode)}
                className="mt-2 h-12 w-full rounded-lg border border-[#cbd3c2] bg-white px-3 text-[#1d261b] outline-none focus:border-[#21442e] focus:ring-2 focus:ring-[#21442e]/15"
              >
                {plans.map((plan) => (
                  <option key={plan.code} value={plan.code}>
                    {plan.name} - {plan.price}
                  </option>
                ))}
              </select>
            </label>

            <Input label="Nome completo" id="name" value={form.name} onChange={(value) => updateField("name", value)} autoComplete="name" />
            <Input label="Telefone WhatsApp" value={form.phone} onChange={(value) => updateField("phone", value)} placeholder="(44) 99999-9999" autoComplete="tel" />
            <Input label="Email" value={form.email} onChange={(value) => updateField("email", value)} type="email" autoComplete="email" />
            <Input label="Nome da fazenda" value={form.farmName} onChange={(value) => updateField("farmName", value)} />
            <Input label="Cidade" value={form.city} onChange={(value) => updateField("city", value)} />

            <label>
              <span className="text-sm font-semibold text-[#30442c]">UF</span>
              <select
                value={form.state}
                onChange={(event) => updateField("state", event.target.value)}
                className="mt-2 h-12 w-full rounded-lg border border-[#cbd3c2] bg-white px-3 text-[#1d261b] outline-none focus:border-[#21442e] focus:ring-2 focus:ring-[#21442e]/15"
              >
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
              className="sm:col-span-2"
            />
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-[#e0a7a7] bg-[#fff4f4] px-4 py-3 text-sm font-medium text-[#8d2727]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-[#21442e] px-5 py-4 font-bold text-white transition hover:bg-[#183523] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={19} />
                Criando checkout...
              </>
            ) : (
              <>
                Ir para pagamento
                <ArrowRight size={19} />
              </>
            )}
          </button>

          <p className="mt-4 text-sm leading-6 text-[#5d6b57]">
            O acesso ao WhatsApp só é liberado após a confirmação do pagamento.
          </p>
        </form>
      </div>
    </section>
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
    <label className={className}>
      <span className="text-sm font-semibold text-[#30442c]">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 h-12 w-full rounded-lg border border-[#cbd3c2] bg-white px-3 text-[#1d261b] outline-none focus:border-[#21442e] focus:ring-2 focus:ring-[#21442e]/15"
      />
    </label>
  );
}

function PaymentStatus({ type }: { type: "approved" | "cancelled" }) {
  const approved = type === "approved";

  return (
    <main className="min-h-screen bg-[#fbfaf6]">
      <Header />
      <section className="mx-auto flex max-w-3xl flex-col items-start px-5 py-20">
        <div className="rounded-lg border border-[#d8ddcf] bg-white p-8 shadow-sm">
          <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg ${approved ? "bg-[#e5f1df] text-[#21442e]" : "bg-[#fff2d2] text-[#755e1d]"}`}>
            {approved ? <Check size={25} /> : <CreditCard size={25} />}
          </div>
          <h1 className="text-3xl font-bold text-[#183523]">
            {approved ? "Pagamento recebido" : "Pagamento cancelado"}
          </h1>
          <p className="mt-4 leading-7 text-[#5d6b57]">
            {approved
              ? "Recebemos o retorno do pagamento. O WhatsApp será liberado após a confirmação da aprovação pela operadora."
              : "O checkout não foi concluído. Você pode voltar para a landing, conferir os dados e tentar novamente."}
          </p>
          <a
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#21442e] px-5 py-3 font-bold text-white transition hover:bg-[#183523]"
          >
            Voltar para a landing
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#d8ddcf] bg-[#fbfaf6] px-5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm text-[#5d6b57] md:flex-row md:items-center">
        <Brand />
        <p>Cadastro pela landing. Liberação no WhatsApp somente após pagamento aprovado.</p>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <main>
      <Header />
      <Hero />
      <HowItWorks />
      <Plans />
      <Benefits />
      <CheckoutForm />
      <Footer />
    </main>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "");

  if (path === "/pagamento/aprovado") {
    return <PaymentStatus type="approved" />;
  }

  if (path === "/pagamento/cancelado") {
    return <PaymentStatus type="cancelled" />;
  }

  return <LandingPage />;
}
