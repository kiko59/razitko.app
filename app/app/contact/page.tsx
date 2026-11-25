import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontakt — Razítko",
  description: "Kontaktné a identifikačné údaje prevádzkovateľa služby Razítko.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Kontakt</h1>
      <p className="mt-3 leading-7 text-slate-700">
        Máte otázku k službe, cenníku alebo potrebujete pomoc? Napíšte nám, odpovieme čo
        najskôr.
      </p>

      <dl className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
        <div className="grid grid-cols-3 gap-4 py-4">
          <dt className="font-medium text-slate-900">Email</dt>
          <dd className="col-span-2 text-slate-700">
            <a className="text-blue-700 underline" href="mailto:kristianzupik8@gmail.com">
              kristianzupik8@gmail.com
            </a>
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4 py-4">
          <dt className="font-medium text-slate-900">Prevádzkovateľ</dt>
          <dd className="col-span-2 text-slate-700">Kristián Župik</dd>
        </div>
        <div className="grid grid-cols-3 gap-4 py-4">
          <dt className="font-medium text-slate-900">IČO</dt>
          <dd className="col-span-2 text-slate-700">54767725</dd>
        </div>
        <div className="grid grid-cols-3 gap-4 py-4">
          <dt className="font-medium text-slate-900">Sídlo</dt>
          <dd className="col-span-2 text-slate-700">Němcovej 31/20, 04001 Košice</dd>
        </div>
      </dl>

      <p className="mt-8 text-sm text-slate-600">
        Pozrite si tiež{" "}
        <Link className="text-blue-700 underline" href="/terms">
          Obchodné podmienky
        </Link>{" "}
        a{" "}
        <Link className="text-blue-700 underline" href="/privacy">
          Zásady ochrany osobných údajov
        </Link>
        .
      </p>
    </main>
  );
}
