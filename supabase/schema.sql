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

-- ============================================================================
-- Predplatné (Stripe): jeden riadok na používateľa.
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  subscription_plan text not null default 'none'
    check (subscription_plan in ('none', 'solo', 'fleet', 'pro')),
  stripe_customer_id text unique,
  stripe_subscription_id text,
  documents_used_this_month integer not null default 0,
  current_period_start timestamptz,
  api_key text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;

-- Len SELECT pre vlastníka riadku. Zámerne žiadna INSERT/UPDATE/DELETE
-- politika pre bežných používateľov — subscription_plan, usage a Stripe ID
-- smie meniť výhradne service role (Stripe webhook, /api/extract), aby si
-- používateľ nemohol cez klientský update sám priradiť platený plán.
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Pri registrácii nového auth.users riadku automaticky založí profil s
-- plánom 'none'. Vzor podľa oficiálnej Supabase dokumentácie — beží ako
-- SECURITY DEFINER, takže nepotrebuje vlastnícke práva na auth.users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill pre používateľov založených pred touto migráciou.
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- Atomický increment počtu vyťažených dokumentov (predchádza race condition
-- pri read-modify-write). Volané zo service role klienta v /api/extract.
create or replace function public.increment_document_usage(p_user_id uuid)
returns void
language sql
security definer set search_path = public
as $$
  update public.profiles
  set documents_used_this_month = documents_used_this_month + 1
  where id = p_user_id;
$$;
