import Stripe from "stripe";

let stripeClient: Stripe | null = null;

// Server-only Stripe client. Never import this from a "use client" file.
export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY nie je nastavený.");
    }
    stripeClient = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  }
  return stripeClient;
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
