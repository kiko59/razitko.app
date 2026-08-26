import Stripe from "stripe";

let stripeClient: Stripe | null = null;

// Server-only Stripe client. Never import this from a "use client" file.
export function getStripe(): Stripe {
  if (!stripeClient) {
    // .trim() guards against a stray trailing newline/space from
    // copy-pasting the value into a dashboard env var field — that turns
    // into a malformed request line/header and shows up as a connection
    // error, not a clean auth error, so it's easy to misdiagnose.
    const key = process.env.STRIPE_SECRET_KEY?.trim();
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY nie je nastavený.");
    }
    stripeClient = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      timeout: 20000,
      maxNetworkRetries: 2,
    });
  }
  return stripeClient;
}
