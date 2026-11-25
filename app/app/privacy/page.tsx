import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Zásady ochrany osobných údajov — Razítko",
  description: "Informácie o spracúvaní osobných údajov v službe Razítko.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Zásady ochrany osobných údajov</h1>
      <p className="mt-2 text-sm text-slate-500">Účinné od 25. novembra 2026</p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">1. Prevádzkovateľ</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Prevádzkovateľom osobných údajov je Kristián Župik, IČO 54767725, so sídlom
          Němcovej 31/20, 04001 Košice. Kontakt vo veciach ochrany údajov:{" "}
          <a className="text-blue-700 underline" href="mailto:kristianzupik8@gmail.com">
            kristianzupik8@gmail.com
          </a>
          .
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">2. Aké údaje spracúvame</h2>
        <ul className="mt-3 list-disc space-y-1 pl-6 leading-7 text-slate-700">
          <li>Údaje o účte: emailová adresa a heslo (heslo sa ukladá iba v zašifrovanej podobe).</li>
          <li>
            Nahraté dokumenty (CMR, BOL, dodacie listy) a z nich extrahované údaje. Tieto
            dokumenty môžu obsahovať mená a adresy osôb a firiem.
          </li>
          <li>Údaje o využívaní služby: zvolený plán, počet extrakcií v danom mesiaci.</li>
          <li>
            Platobné údaje: platby spracúva Stripe. Prevádzkovateľ nemá prístup k číslu
            platobnej karty, uchováva len identifikátory zákazníka a predplatného.
          </li>
          <li>Základné štatistiky návštevnosti webu (počet návštev a zobrazení stránok).</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">3. Účel a právny základ</h2>
        <ul className="mt-3 list-disc space-y-1 pl-6 leading-7 text-slate-700">
          <li>Poskytovanie služby a plnenie zmluvy (čl. 6 ods. 1 písm. b GDPR).</li>
          <li>Fakturácia a plnenie zákonných povinností (čl. 6 ods. 1 písm. c GDPR).</li>
          <li>
            Zabezpečenie služby, predchádzanie zneužitiu a štatistiky návštevnosti — oprávnený
            záujem prevádzkovateľa (čl. 6 ods. 1 písm. f GDPR).
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">4. Sprostredkovatelia</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Na prevádzku služby využívame tieto spracovateľské služby:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-6 leading-7 text-slate-700">
          <li>Supabase — databáza, úložisko súborov a prihlasovanie používateľov.</li>
          <li>Vercel — hosting aplikácie a štatistiky návštevnosti.</li>
          <li>Stripe — spracovanie platieb a správa predplatného.</li>
          <li>
            Anthropic — analýza nahratých dokumentov umelou inteligenciou (dokument sa odošle
            na spracovanie len za účelom extrakcie údajov).
          </li>
        </ul>
        <p className="mt-3 leading-7 text-slate-700">
          Niektorí z týchto poskytovateľov môžu údaje spracúvať aj mimo Európskeho
          hospodárskeho priestoru, najmä v USA. Prenos prebieha na základe štandardných
          zmluvných doložiek alebo iných záruk podľa GDPR.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">5. Doba uchovávania</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Dokumenty a extrahované údaje uchovávame, kým ich používateľ nezmaže alebo kým
          nezruší účet. Účtovné doklady uchovávame po dobu určenú zákonom. Na požiadanie
          môžeme údaje zmazať skôr, ak tomu nebráni zákonná povinnosť.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">6. Cookies</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Používame iba nevyhnutné cookies potrebné na prihlásenie a udržanie relácie.
          Štatistiky návštevnosti nepoužívajú sledovacie cookies na profilovanie
          návštevníkov.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">7. Vaše práva</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Máte právo na prístup k údajom, ich opravu, vymazanie, obmedzenie spracúvania,
          prenosnosť a právo namietať. Uplatniť ich môžete emailom na adrese uvedenej vyššie.
          Máte tiež právo podať sťažnosť Úradu na ochranu osobných údajov Slovenskej republiky
          (dataprotection.gov.sk).
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">8. Zmeny zásad</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Tieto zásady môžeme aktualizovať. Aktuálna verzia je vždy dostupná na tejto stránke.
          Súvisiace dokumenty:{" "}
          <Link className="text-blue-700 underline" href="/terms">
            Obchodné podmienky
          </Link>
          {" "}a{" "}
          <Link className="text-blue-700 underline" href="/contact">
            Kontakt
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
