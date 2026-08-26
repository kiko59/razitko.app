"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLAN_ORDER, PLANS, type PlanId, type SubscriptionPlan } from "@/lib/plans";

interface PricingCardsProps {
  isLoggedIn: boolean;
  currentPlan: SubscriptionPlan | null;
}

export default function PricingCards({ isLoggedIn, currentPlan }: PricingCardsProps) {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(plan: PlanId) {
    setError(null);

    if (!isLoggedIn) {
      router.push(`/login?redirectTo=/pricing`);
      return;
    }

    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || "Nepodarilo sa spustiť platbu.");

      window.location.href = body.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nastala neznáma chyba.");
      setLoadingPlan(null);
    }
  }

  return (
    <div>
      {error && <p className="mb-6 text-center text-sm text-red-600">{error}</p>}
      <div className="grid gap-6 sm:grid-cols-3">
        {PLAN_ORDER.map((planId) => {
          const plan = PLANS[planId];
          const isCurrent = currentPlan === planId;

          return (
            <div
              key={planId}
              className={`flex flex-col rounded-lg border p-6 ${
                planId === "fleet"
                  ? "border-blue-500 shadow-sm"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h2 className="text-lg font-semibold text-slate-900">{plan.name}</h2>
              <p className="mt-1">
                <span className="text-3xl font-bold text-slate-900">{plan.priceEur} €</span>
                <span className="text-sm text-slate-500"> / mesiac</span>
              </p>

              <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={loadingPlan !== null || isCurrent}
                onClick={() => handleSelect(planId)}
                className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCurrent
                  ? "Tvoj aktuálny plán"
                  : loadingPlan === planId
                    ? "Presmerúvam na Stripe…"
                    : "Vybrať plán"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
