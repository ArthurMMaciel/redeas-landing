import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

type PlanCode = "finance_basic" | "finance_safra";

type CheckoutPayload = {
  planCode: PlanCode;
  name: string;
  phone: string;
  email: string;
  farmName: string;
  city: string;
  state: string;
  mainActivity: string;
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

function getCheckoutUrl(planCode: PlanCode) {
  const envName = planCode === "finance_basic" ? "CHECKOUT_URL_FINANCE_BASIC" : "CHECKOUT_URL_FINANCE_SAFRA";
  return Deno.env.get(envName);
}

function validatePayload(payload: Partial<CheckoutPayload>) {
  if (!["finance_basic", "finance_safra"].includes(String(payload.planCode))) {
    return "Plano inválido.";
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

  const checkoutUrl = getCheckoutUrl(payload.planCode as PlanCode);
  if (!checkoutUrl) {
    return jsonResponse(
      {
        success: false,
        message: "Checkout ainda não configurado para este plano.",
      },
      500,
    );
  }

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

  const { data, error } = await supabase
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
      source: "landing_checkout",
    })
    .select("id, plan_code")
    .single();

  if (error) {
    console.error(error);
    return jsonResponse({ success: false, message: "Não foi possível registrar o checkout." }, 500);
  }

  return jsonResponse({
    success: true,
    data: {
      checkoutIntentId: data.id,
      planCode: data.plan_code,
      checkoutUrl,
    },
  });
});
