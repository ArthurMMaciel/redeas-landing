# Redeas Landing

Landing page comercial do Redeas, com cadastro antes do pagamento e checkout via API.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Variaveis de ambiente

Copie `.env.example` para `.env.local` no ambiente local ou configure as mesmas variaveis na Vercel:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.redeas.online
NEXT_PUBLIC_SUPABASE_URL=https://xfemzxgpzhhnymedeepy.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_WfT7Cg5Qc13Ynthp2C7mSQ_PS4rVUqi
```

O frontend usa o Supabase apenas para registrar o lead inicial em `checkout_leads`. A criacao do usuario pagante, fazenda, assinatura e mensagem de WhatsApp continua sendo responsabilidade do backend depois da aprovacao do pagamento.

## Supabase

A migration esta em `supabase/migrations`.

Para aplicar em producao, use o Supabase CLI com credenciais de projeto ou banco configuradas:

```bash
npx supabase link --project-ref xfemzxgpzhhnymedeepy
npx supabase db push
```

A publishable key e publica e pode ser usada no frontend, mas nao serve para rodar migrations.

## Build

```bash
npm run build
```
