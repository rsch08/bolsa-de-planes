-- La bolsa de planes — esquema inicial
-- Pensado para 2 usuarios fijos compartiendo un mismo proyecto de Supabase.

create extension if not exists "pgcrypto";

create type plan_status as enum ('pendiente', 'completado');

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  note text,
  status plan_status not null default 'pendiente',
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  -- ids de un set fijo de usuarios hardcodeados en el cliente (ver src/lib/users.js),
  -- no una FK a auth.users: no usamos Supabase Auth todavía (ver README).
  created_by text not null,
  completed_by text
);

create index if not exists plans_status_idx on plans (status);
create index if not exists plans_completed_at_idx on plans (completed_at desc);

alter table plans enable row level security;

-- Políticas abiertas: pensadas para un link privado compartido solo entre
-- las dos personas que usan la app, no para exposición pública.
-- Endurecer (auth real + policies por usuario) antes de compartir el link.
create policy "select_all" on plans for select using (true);
create policy "insert_all" on plans for insert with check (true);
create policy "update_all" on plans for update using (true) with check (true);
create policy "delete_all" on plans for delete using (true);

-- Habilita la sincronización en tiempo real para esta tabla.
alter publication supabase_realtime add table plans;
