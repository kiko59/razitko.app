import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { planFromPriceId } from "@/lib/plans";

export const runtime = "nodejs";

// Newer Stripe API versions moved current_period_start/end off the
// Subscription object onto each SubscriptionItem (to support items with
// independent billing cycles) — this SDK's types don't reflect that yet, so
// we read the item first and fall back to the older top-level field.
function periodStartIso(subscription: Stripe.Subscription): string | null {
  const item = subscription.items.data[0] as
    | (Stripe.SubscriptionItem & { current_period_start?: number })
    | undefined;
  const start = item?.current_period_start ?? subscription.current_period_start;
  return typeof start === "number" ? new Date(start * 1000).toISOString() : null;
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Chýba webhook konfigurácia." }, { status: 500 });
  }

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Neplatný podpis." }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const subscriptionId = session.subscription;

      if (!userId || !subscriptionId || typeof subscriptionId !== "string") break;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0]?.price.id;
      const plan = planFromPriceId(priceId) ?? "none";

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

      if (error) console.error("checkout.session.completed update failed:", error);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0]?.price.id;
      const plan = planFromPriceId(priceId) ?? "none";
      const newPeriodStart = periodStartIso(subscription);
      const customerId = subscription.customer as string;

      const { data: existing } = await admin
        .from("profiles")
        .select("current_period_start")
        .eq("stripe_customer_id", customerId)
        .single();

      const isNewBillingCycle =
        !!newPeriodStart && existing?.current_period_start !== newPeriodStart;

      const { error } = await admin
        .from("profiles")
        .update({
          stripe_subscription_id: subscription.id,
          // A cancelled-at-period-end subscription is still "active" until
          // Stripe actually deletes it — customer.subscription.deleted
          // (handled below) is what flips the plan to 'none'.
          subscription_plan: subscription.status === "canceled" ? "none" : plan,
          current_period_start: newPeriodStart,
          ...(isNewBillingCycle ? { documents_used_this_month: 0 } : {}),
        })
        .eq("stripe_customer_id", customerId);

      if (error) console.error("customer.subscription.updated failed:", error);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { error } = await admin
        .from("profiles")
        .update({
          subscription_plan: "none",
          stripe_subscription_id: null,
        })
        .eq("stripe_customer_id", customerId);

      if (error) console.error("customer.subscription.deleted failed:", error);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
