alter table public.checkout_leads
  add column if not exists billing_cycle text,
  add column if not exists payment_method text,
  add column if not exists amount_cents integer;

alter table public.checkout_leads
  drop constraint if exists checkout_leads_billing_cycle_check,
  add constraint checkout_leads_billing_cycle_check
    check (billing_cycle is null or billing_cycle in ('monthly', 'annual'));

alter table public.checkout_leads
  drop constraint if exists checkout_leads_payment_method_check,
  add constraint checkout_leads_payment_method_check
    check (payment_method is null or payment_method in ('card', 'pix'));

alter table public.checkout_leads
  drop constraint if exists checkout_leads_amount_cents_check,
  add constraint checkout_leads_amount_cents_check
    check (amount_cents is null or amount_cents > 0);

create index if not exists checkout_leads_plan_payment_idx
on public.checkout_leads (plan_code, billing_cycle, payment_method);
