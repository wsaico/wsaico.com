-- Tabla para almacenar solicitudes de cotización desde wsaico.com
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_type text not null,
  features text[] not null default '{}',
  problem_summary text not null,
  timeline text not null,
  budget_range text,
  full_name text not null,
  company text,
  whatsapp text not null,
  email text not null,
  source_url text,
  status text not null default 'nuevo'
);

alter table public.quote_requests enable row level security;

-- Solo la Service Role Key del backend Vercel puede insertar/leer leads
create policy "Service role full access on quote_requests"
  on public.quote_requests
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
