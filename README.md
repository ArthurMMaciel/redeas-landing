# Redeas Landing

Landing page comercial do Redeas, com cadastro antes do pagamento e checkout via Supabase Edge Functions.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Variaveis de ambiente

Copie `.env.example` para `.env.local` no ambiente local ou configure as mesmas variaveis na Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xfemzxgpzhhnymedeepy.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_WfT7Cg5Qc13Ynthp2C7mSQ_PS4rVUqi
```

O frontend chama diretamente a Edge Function `checkouts` no Supabase. A criacao do usuario pagante, fazenda, assinatura e mensagem de WhatsApp continua acontecendo em funcoes/server-side depois da aprovacao do pagamento.

## Supabase

A migration esta em `supabase/migrations`.

Para aplicar em producao, use o Supabase CLI com credenciais de projeto ou banco configuradas:

```bash
npx supabase link --project-ref xfemzxgpzhhnymedeepy
npx supabase db push
```

A publishable key e publica e pode ser usada no frontend, mas nao serve para rodar migrations.

## Edge Function de checkout

A funcao `supabase/functions/checkouts` valida o formulario, registra o lead em `checkout_leads` e retorna a URL de pagamento.

Configure as URLs reais de checkout como secrets no Supabase:

```bash
npx supabase secrets set CHECKOUT_URL_FINANCE_BASIC="https://checkout..."
npx supabase secrets set CHECKOUT_URL_FINANCE_SAFRA="https://checkout..."
npx supabase functions deploy checkouts
```

## Build

```bash
npm run build
```
