-- Spusti v Supabase SQL editore (Project > SQL Editor)

create table if not exists public.transport_documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  file_name text not null,
  file_path text not null,
  mime_type text not null,
  data jsonb not null
);

alter table public.transport_documents enable row level security;

-- MVP: API routes pristupujú cez service role key, ktorý RLS obchádza.
-- Ak neskôr pridáš prihlásenie používateľov, nahraď túto policy vlastnou.
create policy "service role full access"
  on public.transport_documents
  for all
  using (true)
  with check (true);

-- Storage bucket pre nahrané dokumenty (obrázky / PDF)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "service role storage access"
  on storage.objects
  for all
  using (bucket_id = 'documents')
  with check (bucket_id = 'documents');
