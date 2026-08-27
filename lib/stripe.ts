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

    // Catches a corrupted paste (e.g. a masked/redacted "•" character
    // copied in literally instead of the real character) with a clear
    // error pointing at the exact spot — without this, an invalid
    // character surfaces only as an opaque "connection error" deep
    // inside the HTTP client, because it breaks header construction.
    const badCharIndex = [...key].findIndex((ch) => ch.charCodeAt(0) > 255);
    if (badCharIndex !== -1) {
      throw new Error(
        `STRIPE_SECRET_KEY obsahuje neplatný znak na pozícii ${badCharIndex} ` +
          `(kód ${key.charCodeAt(badCharIndex)}) — over si hodnotu vo Vercel, ` +
          `pravdepodobne vznikla skopírovaním zo zamaskovaného zobrazenia.`,
      );
    }

    stripeClient = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      timeout: 20000,
      maxNetworkRetries: 2,
      // The default Node https-based client is known to fail with
      // "An error occurred with our connection to Stripe" on some
      // serverless platforms (Vercel's Lambda runtime included) — its
      // connection/socket handling doesn't play well with cold-started,
      // short-lived containers. The fetch-based client sidesteps that.
      httpClient: Stripe.createFetchHttpClient(),
    });
  }
  return stripeClient;
}
