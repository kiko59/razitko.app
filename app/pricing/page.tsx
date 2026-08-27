import PricingCards from "@/components/PricingCards";
import PricingFaq from "@/components/PricingFaq";
import PricingComparison from "@/components/PricingComparison";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-primary">Cenník</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
          Solo, Fleet alebo Pro — CMR extrakcia pre každú flotilu.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Tri plány pre jeden CMR sken, hromadný upload aj API integráciu. Ceny
          v EUR, mesačne, bez DPH. Vyber si podľa veľkosti flotily — kedykoľvek
          môžeš zmeniť alebo zrušiť.
        </p>
      </div>

      <section id="faq" className="mt-16 scroll-mt-16">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          FAQ k plánom
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
          Odpovede pred výberom plánu
        </h2>
        <div className="mt-6">
          <PricingFaq />
        </div>
      </section>

      <section className="mt-16">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Porovnanie plánov
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
          Solo vs Fleet vs Pro — čo dostanete v každom pláne.
        </h2>
        <div className="mt-6">
          <PricingComparison />
        </div>
      </section>

      <section className="mt-16">
        <PricingCards />
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Pre enterprise a individuálne ceny nás kontaktujte.
        </p>
      </section>
    </main>
  );
}
