const FAQ_ITEMS = [
  {
    question: "Kde sú moje dáta uložené a kto k nim má prístup?",
    answer:
      "Dokumenty a extrahované dáta sú uložené v Supabase (PostgreSQL + Storage). Vďaka Row Level Security vidí každý používateľ výhradne svoje vlastné dokumenty — nikto iný, ani v rámci rovnakého plánu.",
  },
  {
    question: "Ktoré jazyky extrakcia podporuje?",
    answer:
      "Solo pokrýva slovenčinu, češtinu a angličtinu. Fleet pridáva nemčinu a francúzštinu. Pro podporuje všetky aktuálne jazyky vrátane early-access k novým.",
  },
  {
    question: "Akú presnosť môžem čakať hneď od prvého dňa?",
    answer:
      "Extrakcia beží na modeli Claude s vysokou presnosťou pri čitateľných skenoch a fotkách. Neisté alebo nečitateľné polia extrakcia označí a necháva na doplnenie v editovateľnom formulári pred uložením.",
  },
  {
    question: "Aký support patrí ku každému plánu?",
    answer:
      "Solo má e-mailový support na best-effort báze. Fleet garantuje odpoveď do 24 hodín. Pro má dedikovaný kontakt a asistovaný onboarding.",
  },
];

export default function PricingFaq() {
  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {FAQ_ITEMS.map((item) => (
        <details key={item.question} className="group p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground">
            {item.question}
            <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
