import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Obchodné podmienky — Razítko",
  description: "Obchodné podmienky služby Razítko na spracovanie prepravných dokumentov.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Obchodné podmienky</h1>
      <p className="mt-2 text-sm text-slate-500">Účinné od 25. novembra 2026</p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">1. Prevádzkovateľ</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Službu Razítko (razitko.app) prevádzkuje Kristián Župik, IČO 54767725, so sídlom
          Němcovej 31/20, 04001 Košice (ďalej len „prevádzkovateľ“). Kontakt:{" "}
          <a className="text-blue-700 underline" href="mailto:kristianzupik8@gmail.com">
            kristianzupik8@gmail.com
          </a>
          .
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">2. Predmet služby</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Razítko je webová aplikácia, ktorá z nahratých prepravných dokumentov (CMR, BOL,
          dodacie listy) pomocou umelej inteligencie extrahuje údaje, ako sú odosielateľ,
          príjemca, hmotnosť, referenčné číslo a dátumy. Extrahované údaje je možné upraviť,
          uložiť a exportovať vo formáte PDF alebo JSON.
        </p>
        <p className="mt-3 leading-7 text-slate-700">
          Služba je určená podnikateľom a firmám. Nie je určená spotrebiteľom.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">3. Používateľský účet</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Na používanie služby je potrebná registrácia emailom a heslom. Používateľ zodpovedá
          za pravdivosť údajov pri registrácii a za zabezpečenie prístupových údajov. Účet nie
          je možné prenášať na tretie osoby nad rámec počtu sedadiel zvoleného plánu.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">4. Plány, ceny a platby</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Služba sa poskytuje formou mesačného predplatného v troch plánoch. Ceny sú uvedené v
          eurách bez DPH.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-6 leading-7 text-slate-700">
          <li>Solo — 49 € mesačne: 1 kamión, 60 extrakcií mesačne, jazyky SK, CZ, EN.</li>
          <li>
            Fleet — 149 € mesačne: 2 až 5 kamiónov, 250 extrakcií mesačne, jazyky SK, CZ, EN,
            DE, FR, REST API ako voliteľný doplnok.
          </li>
          <li>
            Pro — 300 € mesačne: 6 až 10 kamiónov, neobmedzený počet extrakcií, všetky jazyky,
            REST API a webhooky.
          </li>
        </ul>
        <p className="mt-3 leading-7 text-slate-700">
          Platby sa vykonávajú kartou prostredníctvom spoločnosti Stripe. Prevádzkovateľ
          neukladá čísla platobných kariet. Predplatné sa automaticky obnovuje na každé ďalšie
          mesačné obdobie, kým ho používateľ nezruší.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">5. Zrušenie a zmena plánu</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Predplatné je možné zrušiť kedykoľvek v nastaveniach účtu (správa predplatného).
          Zrušenie nadobúda účinnosť na konci už zaplateného mesačného obdobia. Platby za
          uplynulé obdobie sa nevracajú, ak nie je dohodnuté inak. Plán je možné zmeniť
          kedykoľvek, nová cena sa uplatní podľa pravidiel spoločnosti Stripe.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">6. Limity a primerané používanie</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Každý plán má mesačný limit extrakcií. Po jeho vyčerpaní je potrebné prejsť na vyšší
          plán alebo počkať na začiatok nového obdobia. Zakázané je používať službu na
          nezákonné účely, nahrávať škodlivý obsah, obchádzať limity alebo ohrozovať
          bezpečnosť a dostupnosť služby.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">7. Presnosť extrakcie</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Extrakcia údajov využíva umelú inteligenciu a môže obsahovať chyby, najmä pri
          nečitateľných skenoch alebo rukou písanom texte. Služba označuje neisté polia, no
          používateľ je povinný údaje pred uložením a ďalším použitím skontrolovať.
          Prevádzkovateľ nezodpovedá za škody vzniknuté použitím nesprávne extrahovaných údajov,
          ktoré používateľ nekontroloval.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">8. Údaje a súkromie</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Nahraté dokumenty a extrahované údaje sú uložené tak, že každý používateľ má prístup
          iba k svojim vlastným dokumentom. Podrobnosti o spracúvaní osobných údajov sú v{" "}
          <Link className="text-blue-700 underline" href="/privacy">
            Zásadách ochrany osobných údajov
          </Link>
          .
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">9. Dostupnosť a zmeny služby</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Prevádzkovateľ vyvíja primerané úsilie na nepretržitú dostupnosť služby, no
          negarantuje ju bez výpadkov. Funkcie a ceny sa môžu meniť. O zmene ceny existujúcich
          predplatiteľov informuje prevádzkovateľ vopred emailom.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">10. Obmedzenie zodpovednosti</h2>
        <p className="mt-3 leading-7 text-slate-700">
          V rozsahu povolenom právnymi predpismi je celková zodpovednosť prevádzkovateľa
          voči používateľovi obmedzená na výšku poplatkov zaplatených za službu za posledných
          12 mesiacov. Prevádzkovateľ nezodpovedá za nepriame škody ani ušlý zisk.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">11. Záverečné ustanovenia</h2>
        <p className="mt-3 leading-7 text-slate-700">
          Tieto podmienky sa riadia právnym poriadkom Slovenskej republiky. Spory sa riešia
          pred príslušným súdom v Slovenskej republike. Prevádzkovateľ môže podmienky zmeniť,
          o zmene informuje používateľov na webe alebo emailom.
        </p>
      </section>
    </main>
  );
}
