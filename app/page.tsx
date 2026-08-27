import Link from "next/link";

const STEPS = [
  {
    step: "Krok 1",
    title: "Odfotíš / nahráš CMR",
    body: "Screenshot, scan alebo fotka z telefónu — Razítko príjme čokoľvek, čo dostaneš od vodiča.",
  },
  {
    step: "Krok 2",
    title: "Razítko vyextrahuje polia",
    body: "Claude AI vytiahne odosielateľa, príjemcu, váhu, referenčné číslo aj miesta nakládky a vykládky do upraviteľného náhľadu.",
  },
  {
    step: "Krok 3",
    title: "Uložíš a stiahneš PDF alebo JSON",
    body: "Skontrolované dáta pošleš do účtovníctva alebo TMS — cez PDF, JSON export, alebo priamo cez REST API na Fleet a Pro pláne.",
  },
];

const DEMO_FIELDS = [
  { label: "ODOSIELATEĽ", value: "Muster Speditions GmbH, Leipzig, DE" },
  { label: "PRÍJEMCA", value: "Prevádzka s.r.o., Bratislava, SK" },
  { label: "VÁHA", value: "1 240 kg" },
  { label: "REFERENČNÉ ČÍSLO", value: "CMR-2026-0342" },
  { label: "DÁTUM NAKLÁDKY", value: "2026-03-14" },
  { label: "MIESTO VYKLÁDKY", value: "Bratislava, SK" },
];

export default function LandingPage() {
  return (
    <div>
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-lg font-semibold text-foreground">Razítko</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              Cenník
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground">
              Prihlásiť sa
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground hover:opacity-90"
            >
              Vyskúšať zdarma
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <section>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Pre dispečerov a prepravné firmy
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
            Ešte stále prepisuješ CMR večer?
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Razítko prečíta CMR, BOL aj dodacie listy za pár sekúnd. Stačí
            nahrať sken alebo fotku z telefónu a AI vytiahne všetky polia
            pripravené na uloženie alebo export.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Vyskúšať zdarma
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Už máš účet? Prihlás sa →
            </Link>
          </div>
        </section>

        <section className="mt-20">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Ukážka extrakcie
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
            Sken vľavo, dáta vpravo — bez prepisovania.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Vstup
              </p>
              <p className="mt-1 text-sm text-foreground">Naskenovaný CMR / dodací list</p>
              <div className="mt-4 flex h-48 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                Ukážka — statický náhľad, žiadny reálny súbor.
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Extrahované polia
              </p>
              <p className="mt-1 text-sm text-foreground">
                Kľúčové polia pripravené na uloženie.
              </p>
              <dl className="mt-4 space-y-3">
                {DEMO_FIELDS.map((field) => (
                  <div key={field.label} className="flex justify-between gap-4 text-sm">
                    <dt className="text-muted-foreground">{field.label}</dt>
                    <dd className="text-right text-foreground">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Ako to funguje
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
            Tri kroky od fotky CMR po hotové dáta
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="rounded-lg border border-border bg-card p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {s.step}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground">Vyskúšaj Razítko zadarma</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Vyber si plán a začni šetriť čas hneď dnes.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Vyskúšať zdarma
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pozrieť cenník →
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground">
          <span>Razítko</span>
          <nav className="flex gap-4">
            <Link href="/pricing#faq" className="hover:text-foreground">
              FAQ
            </Link>
            <Link href="/pricing" className="hover:text-foreground">
              Cenník
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Prihlásiť sa
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
