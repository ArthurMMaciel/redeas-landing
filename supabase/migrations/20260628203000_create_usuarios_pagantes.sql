create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  nome_completo text not null,
  email text not null unique,
  telefone text not null,
  nome_fazenda text not null,
  cidade text not null,
  uf char(2) not null,
  atividade_principal text not null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.usuarios_pagantes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  codigo_plano text not null check (codigo_plano in ('finance_basic', 'finance_safra')),
  ciclo text not null check (ciclo in ('monthly', 'annual')),
  forma_pagamento text not null check (forma_pagamento in ('card', 'pix')),
  valor_centavos integer not null check (valor_centavos > 0),
  status text not null default 'confirmado' check (status in ('confirmado', 'cancelado', 'reembolsado')),
  confirmado_em timestamptz not null default now(),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists usuarios_email_idx on public.usuarios (email);
create index if not exists usuarios_pagantes_usuario_id_idx on public.usuarios_pagantes (usuario_id);
create index if not exists usuarios_pagantes_status_idx on public.usuarios_pagantes (status);

alter table public.usuarios enable row level security;
alter table public.usuarios_pagantes enable row level security;
