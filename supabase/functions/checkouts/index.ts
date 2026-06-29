import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

type PlanCode = "finance_basic" | "finance_safra";
type BillingCycle = "monthly" | "annual";
type PaymentMethod = "card" | "pix";

type CheckoutPayload = {
  planCode: PlanCode;
  name: string;
  phone: string;
  email: string;
  farmName: string;
  city: string;
  state: string;
  mainActivity: string;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  amountCents: number;
};

const planPrices: Record<PlanCode, { monthly: number; annual: number }> = {
  finance_basic: {
    monthly: 2590,
    annual: 27480,
  },
  finance_safra: {
    monthly: 4790,
    annual: 52680,
  },
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function validatePayload(payload: Partial<CheckoutPayload>) {
  if (!["finance_basic", "finance_safra"].includes(String(payload.planCode))) {
    return "Plano inválido.";
  }

  if (!["monthly", "annual"].includes(String(payload.billingCycle))) {
    return "Periodo de cobranca invalido.";
  }

  if (!["card", "pix"].includes(String(payload.paymentMethod))) {
    return "Forma de pagamento invalida.";
  }

  const planCode = payload.planCode as PlanCode;
  const billingCycle = payload.billingCycle as BillingCycle;
  const expectedAmount = planPrices[planCode][billingCycle];
  if (Number(payload.amountCents) !== expectedAmount) {
    return "Valor invalido para o plano selecionado.";
  }

  const required: Array<[keyof CheckoutPayload, string]> = [
    ["name", "Informe o nome completo."],
    ["phone", "Informe o telefone WhatsApp."],
    ["email", "Informe o email."],
    ["farmName", "Informe o nome da fazenda."],
    ["city", "Informe a cidade."],
    ["state", "Informe a UF."],
    ["mainActivity", "Informe a atividade ou cultura principal."],
  ];

  for (const [field, message] of required) {
    if (!String(payload[field] || "").trim()) return message;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email).trim())) {
    return "Informe um email válido.";
  }

  if (!/^[A-Z]{2}$/.test(String(payload.state))) {
    return "Informe uma UF válida.";
  }

  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, message: "Método não permitido." }, 405);
  }

  const payload = (await req.json().catch(() => null)) as Partial<CheckoutPayload> | null;
  if (!payload) {
    return jsonResponse({ success: false, message: "Payload inválido." }, 400);
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return jsonResponse({ success: false, message: validationError }, 400);
  }

  const checkoutPayload = payload as CheckoutPayload;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ success: false, message: "Supabase não configurado na Edge Function." }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  const { data: leadData, error: leadError } = await supabase
    .from("checkout_leads")
    .insert({
      plan_code: payload.planCode,
      name: String(payload.name).trim(),
      phone: String(payload.phone).trim(),
      email: String(payload.email).trim(),
      farm_name: String(payload.farmName).trim(),
      city: String(payload.city).trim(),
      state: payload.state,
      main_activity: String(payload.mainActivity).trim(),
      billing_cycle: checkoutPayload.billingCycle,
      payment_method: checkoutPayload.paymentMethod,
      amount_cents: checkoutPayload.amountCents,
      source: "landing_checkout",
    })
    .select("id, plan_code")
    .single();

  if (leadError) {
    console.error(leadError);
    return jsonResponse({ success: false, message: "Não foi possível registrar o checkout." }, 500);
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .upsert(
      {
        nome_completo: String(payload.name).trim(),
        email: String(payload.email).trim().toLowerCase(),
        telefone: String(payload.phone).trim(),
        nome_fazenda: String(payload.farmName).trim(),
        cidade: String(payload.city).trim(),
        uf: payload.state,
        atividade_principal: String(payload.mainActivity).trim(),
        atualizado_em: new Date().toISOString(),
      },
      { onConflict: "email" },
    )
    .select("id, nome_completo, email, telefone")
    .single();

  if (usuarioError || !usuario) {
    console.error(usuarioError);
    return jsonResponse({ success: false, message: "Não foi possível criar o usuário pagante." }, 500);
  }

  const { data: usuarioPagante, error: usuarioPaganteError } = await supabase
    .from("usuarios_pagantes")
    .insert({
      usuario_id: usuario.id,
      codigo_plano: checkoutPayload.planCode,
      ciclo: checkoutPayload.billingCycle,
      forma_pagamento: checkoutPayload.paymentMethod,
      valor_centavos: checkoutPayload.amountCents,
      status: "confirmado",
    })
    .select("id, usuario_id, codigo_plano, ciclo, forma_pagamento, valor_centavos, status, confirmado_em")
    .single();

  if (usuarioPaganteError || !usuarioPagante) {
    console.error(usuarioPaganteError);
    return jsonResponse({ success: false, message: "Não foi possível confirmar o pagamento." }, 500);
  }

  return jsonResponse({
    success: true,
    data: {
      checkoutIntentId: leadData.id,
      planCode: leadData.plan_code,
      usuario: {
        id: usuario.id,
        name: usuario.nome_completo,
        email: usuario.email,
        phone: usuario.telefone,
      },
      usuarioPagante: {
        id: usuarioPagante.id,
        status: usuarioPagante.status,
        createdAt: usuarioPagante.confirmado_em,
      },
    },
  });
});
