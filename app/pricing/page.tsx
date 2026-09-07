import Link from "next/link";
import { getTranslations } from "next-intl/server";
import PricingCards from "@/components/PricingCards";
import PricingFaq from "@/components/PricingFaq";
import PricingComparison from "@/components/PricingComparison";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default async function PricingPage() {
  const t = await getTranslations("pricing");
  const tNav = await getTranslations("nav");

  return (
    <div>
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-semibold text-foreground">
            Razítko
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-muted-foreground hover:text-foreground">
              {tNav("login")}
            </Link>
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
            {t("heading")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {t("subheading")}
          </p>
        </div>

        <section id="faq" className="mt-16 scroll-mt-16">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {t("faq.eyebrow")}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
            {t("faq.heading")}
          </h2>
          <div className="mt-6">
            <PricingFaq />
          </div>
        </section>

        <section className="mt-16">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {t("comparison.eyebrow")}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
            {t("comparison.heading")}
          </h2>
          <div className="mt-6">
            <PricingComparison />
          </div>
        </section>

        <section className="mt-16">
          <PricingCards />
          <p className="mt-8 text-center text-sm text-muted-foreground">{t("enterprise")}</p>
        </section>
      </main>
    </div>
  );
}
