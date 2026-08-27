import Link from "next/link";
import { PLAN_ORDER, PLANS } from "@/lib/plans";

export default function PricingCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {PLAN_ORDER.map((planId) => {
        const plan = PLANS[planId];
        const isFeatured = planId === "fleet";

        return (
          <div
            key={planId}
            className={`relative flex flex-col rounded-lg border bg-card p-6 ${
              isFeatured ? "border-primary" : "border-border"
            }`}
          >
            {isFeatured && (
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Najpopulárnejší
              </span>
            )}

            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {plan.trucks}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{plan.name}</h2>

            <p className="mt-4">
              <span className="text-3xl font-bold text-foreground">{plan.priceEur} €</span>
              <span className="text-sm text-muted-foreground"> bez DPH / mesiac</span>
            </p>

            <ol className="mt-6 flex-1 space-y-3 text-sm text-muted-foreground">
              {plan.features.map((feature, i) => (
                <li key={feature} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                    {i + 1}
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ol>

            <Link
              href={`/signup?tier=${planId}`}
              className={`mt-6 w-full rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
                isFeatured
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              Vybrať {plan.name}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
