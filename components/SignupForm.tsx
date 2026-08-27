"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PLAN_ORDER, PLANS, type PlanId } from "@/lib/plans";

interface SignupFormProps {
  initialTier: PlanId;
  isLoggedIn: boolean;
  userEmail: string | null;
}

export default function SignupForm({ initialTier, isLoggedIn, userEmail }: SignupFormProps) {
  const [tier, setTier] = useState<PlanId>(initialTier);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  async function goToCheckout(plan: PlanId) {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.error || "Nepodarilo sa spustiť platbu.");
    window.location.href = body.url;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isLoggedIn) {
        await goToCheckout(tier);
        return;
      }

      const supabase = createClient();
      const redirectTo = `/signup?tier=${tier}`;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (signUpError) throw signUpError;

      if (data.session) {
        await goToCheckout(tier);
        return;
      }

      // Email confirmation is required on this project — there's no session
      // yet to start a checkout with. They'll land back on this exact page,
      // already signed in, once they click the confirmation link.
      setConfirmEmailSent(true);
      setIsSubmitting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nastala neznáma chyba.");
      setIsSubmitting(false);
    }
  }

  if (confirmEmailSent) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground">Skontroluj svoj email</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Poslali sme ti potvrdzovací odkaz na <span className="text-foreground">{email}</span>.
          Po potvrdení ťa vrátime rovno sem, aby si mohol/a dokončiť platbu za plán{" "}
          {PLANS[tier].name}.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-8">
      <h1 className="text-xl font-semibold text-foreground">
        {isLoggedIn ? "Dokonči predplatné" : "Vytvor si účet"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {isLoggedIn
          ? `Pokračuješ ako ${userEmail}.`
          : `Začni s plánom ${PLANS[tier].name} — vyber si nižšie.`}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Vyber si plán</p>
          <div className="space-y-2">
            {PLAN_ORDER.map((planId) => {
              const plan = PLANS[planId];
              const isSelected = tier === planId;
              return (
                <label
                  key={planId}
                  className={`relative flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <input
                    type="radio"
                    name="tier"
                    value={planId}
                    checked={isSelected}
                    onChange={() => setTier(planId)}
                    className="mt-1 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">{plan.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {plan.priceEur} € mesačne
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{plan.trucks}</p>
                  </div>
                  {planId === "fleet" && (
                    <span className="absolute -top-2 right-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                      Najpopulárnejší
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {!isLoggedIn && (
          <>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-foreground">Meno</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-foreground">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-foreground">Heslo</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </label>
          </>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Chvíľu strpenia…"
            : isLoggedIn
              ? "Pokračovať na platbu →"
              : "Vytvoriť účet a zaplatiť →"}
        </button>
      </form>

      {!isLoggedIn && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Už máš účet?{" "}
          <Link
            href={`/login?redirectTo=${encodeURIComponent(`/signup?tier=${tier}`)}`}
            className="text-primary hover:underline"
          >
            Prihlás sa
          </Link>
        </p>
      )}

      <p className="mt-2 text-center text-sm text-muted-foreground">
        <Link href="/pricing#faq" className="text-primary hover:underline">
          Máte otázky? Pozrite si FAQ →
        </Link>
      </p>
    </div>
  );
}
