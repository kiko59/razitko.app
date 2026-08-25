-- Spusti v Supabase SQL editore (Project > SQL Editor)
-- Tento skript je idempotentný — dá sa bezpečne spustiť opakovane
-- (aj nad databázou, kde už bola spustená staršia verzia tejto schémy).

create table if not exists public.transport_documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  file_name text not null,
  file_path text not null,
  mime_type text not null,
  data jsonb not null
);

-- Priradenie dokumentu k prihlásenému používateľovi.
-- Pozn.: ak tabuľka už obsahuje riadky bez user_id, najprv ich dopĺň alebo zmaž —
-- tento ALTER zlyhá, kým v nej existuje čo i len jeden riadok s NULL user_id.
alter table public.transport_documents
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.transport_documents
  alter column user_id set not null;

alter table public.transport_documents enable row level security;

-- Staršia (príliš permisívna) politika z prvej verzie schémy — nahrádzame ju.
drop policy if exists "service role full access" on public.transport_documents;
drop policy if exists "Users can manage their own documents" on public.transport_documents;

-- Každý používateľ vidí a spravuje výhradne svoje vlastné dokumenty.
create policy "Users can manage their own documents"
  on public.transport_documents
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Storage bucket pre nahrané dokumenty (obrázky / PDF)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Pozn.: RLS na storage.objects Supabase zapína automaticky a projektová
-- rola nemá práva ju sama prepínať (ALTER by zlyhal na "must be owner of
-- table objects") — stačí na nej spravovať politiky, čo robíme nižšie.

-- Staršia (príliš permisívna) storage politika — nahrádzame ju.
drop policy if exists "service role storage access" on storage.objects;
drop policy if exists "Users can manage their own files" on storage.objects;

-- Aplikácia ukladá súbory na cestu "<user_id>/<document_id>/<filename>",
-- takže stačí porovnať prvý segment cesty s ID prihláseného používateľa.
create policy "Users can manage their own files"
  on storage.objects
  for all
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
