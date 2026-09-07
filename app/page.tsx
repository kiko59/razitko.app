import Link from "next/link";
import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default async function LandingPage() {
  const t = await getTranslations("landing");
  const tNav = await getTranslations("nav");

  const demoFields = [
    { label: t("demo.fields.sender"), value: "Muster Speditions GmbH, Leipzig, DE" },
    { label: t("demo.fields.recipient"), value: "Prevádzka s.r.o., Bratislava, SK" },
    { label: t("demo.fields.weight"), value: "1 240 kg" },
    { label: t("demo.fields.reference"), value: "CMR-2026-0342" },
    { label: t("demo.fields.loadingDate"), value: "2026-03-14" },
    { label: t("demo.fields.unloadingPlace"), value: "Bratislava, SK" },
  ];

  const steps = [1, 2, 3].map((n) => ({
    label: t(`howItWorks.step${n}Label` as "howItWorks.step1Label"),
    title: t(`howItWorks.step${n}Title` as "howItWorks.step1Title"),
    body: t(`howItWorks.step${n}Body` as "howItWorks.step1Body"),
  }));

  return (
    <div>
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-lg font-semibold text-foreground">Razítko</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              {tNav("pricing")}
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground">
              {tNav("login")}
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground hover:opacity-90"
            >
              {tNav("tryFree")}
            </Link>
            <LocaleSwitcher />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <section>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
            {t("heading")}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            {t("subheading")}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              {t("ctaPrimary")}
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              {t("ctaSecondary")}
            </Link>
          </div>
        </section>

        <section className="mt-20">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {t("demo.eyebrow")}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
            {t("demo.heading")}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("demo.inputLabel")}
              </p>
              <p className="mt-1 text-sm text-foreground">{t("demo.inputTitle")}</p>
              <div className="mt-4 flex h-48 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                {t("demo.inputPlaceholder")}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("demo.outputLabel")}
              </p>
              <p className="mt-1 text-sm text-foreground">{t("demo.outputTitle")}</p>
              <dl className="mt-4 space-y-3">
                {demoFields.map((field) => (
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
            {t("howItWorks.eyebrow")}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
            {t("howItWorks.heading")}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-card p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {s.label}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground">{t("ctaSection.heading")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("ctaSection.subheading")}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              {t("ctaSection.primary")}
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              {t("ctaSection.secondary")}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground">
          <span>Razítko</span>
          <nav className="flex gap-4">
            <Link href="/pricing#faq" className="hover:text-foreground">
              {t("footer.faq")}
            </Link>
            <Link href="/pricing" className="hover:text-foreground">
              {t("footer.pricing")}
            </Link>
            <Link href="/login" className="hover:text-foreground">
              {t("footer.login")}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
