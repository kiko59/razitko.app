"use client";

import { useState } from "react";

export default function BillingClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOpenPortal() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || "Nepodarilo sa otvoriť portál.");
      window.location.href = body.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nastala neznáma chyba.");
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleOpenPortal}
        disabled={isLoading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Otváram Stripe portál…" : "Spravovať predplatné"}
      </button>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}
