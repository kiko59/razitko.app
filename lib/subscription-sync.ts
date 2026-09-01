import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { planFromPriceId } from "@/lib/plans";

// Newer Stripe API versions moved current_period_start/end off the
// Subscription object onto each SubscriptionItem (to support items with
// independent billing cycles) — this SDK's types don't reflect that yet, so
// we read the item first and fall back to the older top-level field.
export function periodStartIso(subscription: Stripe.Subscription): string | null {
  const item = subscription.items.data[0] as
    | (Stripe.SubscriptionItem & { current_period_start?: number })
    | undefined;
  const start = item?.current_period_start ?? subscription.current_period_start;
  return typeof start === "number" ? new Date(start * 1000).toISOString() : null;
}

// Writes the plan a completed Checkout Session paid for onto the matching
// profile. Called from the checkout.session.completed webhook, and again
// as a fallback from the post-checkout redirect (/app?session_id=...) —
// belt-and-suspenders in case the webhook is delayed, misconfigured, or
// hasn't fired yet by the time the browser lands back on the app. Safe to
// call more than once for the same session: every field it writes is
// derived fresh from Stripe, so repeat calls just re-assert the same state.
export async function syncProfileFromCheckoutSession(sessionId: string): Promise<void> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const userId = session.metadata?.supabase_user_id;
  const subscriptionId = session.subscription;
  if (!userId || !subscriptionId || typeof subscriptionId !== "string") return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const plan = planFromPriceId(priceId) ?? "none";

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription.id,
      subscription_plan: plan,
      current_period_start: periodStartIso(subscription),
      documents_used_this_month: 0,
    })
    .eq("id", userId);

  if (error) console.error("syncProfileFromCheckoutSession update failed:", error);
}
