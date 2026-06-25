create extension if not exists pgcrypto;

create table if not exists public.checkout_leads (
  id uuid primary key default gen_random_uuid(),
  plan_code text not null check (plan_code in ('finance_basic', 'finance_safra')),
  name text not null,
  phone text not null,
  email text not null,
  farm_name text not null,
  city text not null,
  state char(2) not null,
  main_activity text not null,
  source text not null default 'landing_checkout',
  created_at timestamptz not null default now()
);

create index if not exists checkout_leads_phone_idx on public.checkout_leads (phone);
create index if not exists checkout_leads_email_idx on public.checkout_leads (email);
create index if not exists checkout_leads_created_at_idx on public.checkout_leads (created_at desc);

alter table public.checkout_leads enable row level security;

drop policy if exists "Anyone can create checkout leads" on public.checkout_leads;

create policy "Anyone can create checkout leads"
on public.checkout_leads
for insert
to anon, authenticated
with check (
  plan_code in ('finance_basic', 'finance_safra')
  and length(trim(name)) > 0
  and length(trim(phone)) > 0
  and length(trim(email)) > 0
  and length(trim(farm_name)) > 0
  and length(trim(city)) > 0
  and state ~ '^[A-Z]{2}$'
  and length(trim(main_activity)) > 0
);
