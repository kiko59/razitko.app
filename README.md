# Razítko

MVP aplikácie na spracovanie prepravných dokumentov (CMR, BOL, dodacie listy) — nahratie dokumentu, extrakcia dát cez Claude (vision), úprava vo formulári, uloženie do Supabase a export ako PDF/JSON.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres databáza + Storage)
- Anthropic API (Claude, `claude-opus-5`) — extrakcia dát z obrázka/PDF cez `messages.parse` so štruktúrovaným výstupom (Zod schéma)
- `pdf-lib` — generovanie PDF exportu (s vloženým fontom DejaVu Sans pre diakritiku)

## Nastavenie

1. **Nainštaluj závislosti** (vyžaduje Node.js ≥ 18.18):

   ```bash
   npm install
   ```

2. **Supabase**
   - Vytvor projekt na [supabase.com](https://supabase.com).
   - V SQL editore spusti obsah [`supabase/schema.sql`](supabase/schema.sql) — vytvorí tabuľku `transport_documents` a storage bucket `documents`.
   - Skopíruj URL, `anon` kľúč a `service_role` kľúč z Project Settings > API.

3. **Anthropic API kľúč**
   - Vytvor kľúč na [console.anthropic.com](https://console.anthropic.com/settings/keys).

4. **Environment premenné**

   ```bash
   cp .env.local.example .env.local
   ```

   a vyplň hodnoty zo Supabase a Anthropic konzoly.

5. **Spustenie**

   ```bash
   npm run dev
   ```

   Aplikácia beží na [http://localhost:3000](http://localhost:3000).

## Štruktúra

```
app/
  page.tsx                     — hlavná stránka (upload → formulár → export)
  api/extract/route.ts         — POST: obrázok/PDF → Claude vision → extrahované dáta
  api/documents/route.ts       — POST: uloženie (Storage + DB), GET: zoznam
  api/documents/[id]/route.ts  — GET: detail dokumentu / JSON export
  api/export/pdf/route.ts      — GET: PDF export uloženého dokumentu
components/
  DocumentUpload.tsx           — drag & drop upload + volanie extrakcie
  ExtractedDataForm.tsx        — upraviteľný formulár nad extrahovanými dátami
  ExportButtons.tsx            — tlačidlá na stiahnutie PDF/JSON
lib/
  types.ts                     — zdieľané typy
  extraction-schema.ts         — Zod schéma + prompt pre extrakciu
  anthropic.ts                 — Claude klient a extrakčná funkcia
  supabase/                    — browser a server Supabase klienti
supabase/schema.sql             — DB schéma + storage bucket
assets/fonts/                   — DejaVu Sans (PDF export, podpora diakritiky)
```

## Poznámky k MVP

- Model je nastaviteľný cez `ANTHROPIC_MODEL` (predvolene `claude-opus-5`); pri veľkom objeme dokumentov zváž `claude-sonnet-5` pre nižšie náklady.
- Extrakcia aj uloženie zatiaľ nemajú autentifikáciu používateľov — API routes používajú Supabase `service_role` kľúč, ktorý obchádza RLS. Pred nasadením do produkcie pridaj auth a upresni RLS politiky v `supabase/schema.sql`.
- Maximálna veľkosť nahrávaného súboru je 15 MB (obrázok alebo PDF).
