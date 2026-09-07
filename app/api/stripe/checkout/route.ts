import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { getApiTranslator, getLocaleFromCookies } from "@/lib/i18n-server";
import { PLANS, isPlanId } from "@/lib/plans";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const t = await getApiTranslator();

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: t("errors.notLoggedIn") }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const plan = body?.plan;

    if (!isPlanId(plan)) {
      return NextResponse.json({ error: t("errors.invalidPlan") }, { status: 400 });
    }

    const planConfig = PLANS[plan];
    if (!planConfig.priceId) {
      return NextResponse.json(
        { error: t("errors.missingPriceConfig", { plan: plan.toUpperCase() }) },
        { status: 500 },
      );
    }

    const stripe = getStripe();
    const admin = createAdminClient();

    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await admin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // The request's own origin is always the real deployed URL (Vercel sets
    // the Host header correctly per-environment) — more reliable than an
    // env var that's easy to leave pointed at localhost after copying from
    // a local .env file.
    const appUrl = req.nextUrl.origin;

    // `managed_payments` isn't in this SDK's checkout param types yet (newer
    // API surface than what's bundled), but Stripe accepts it — needed
    // because Managed Payments is on by default and would otherwise require
    // a tax_code on every product just to create a session.
    const params: Stripe.Checkout.SessionCreateParams & {
      managed_payments?: { enabled: boolean };
    } = {
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${appUrl}/checkout/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      metadata: { supabase_user_id: user.id, plan },
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan },
      },
      managed_payments: { enabled: false },
      // Matches Stripe's own supported locale codes 1:1 with ours.
      locale: getLocaleFromCookies(),
    };

    const session = await stripe.checkout.sessions.create(params);

    if (!session.url) {
      return NextResponse.json({ error: t("errors.stripeNoUrl") }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    const message = err instanceof Error ? err.message : "Unknown error.";

    return NextResponse.json(
      { error: t("errors.checkoutCreateFailed", { message }) },
      { status: 500 },
    );
  }
}
