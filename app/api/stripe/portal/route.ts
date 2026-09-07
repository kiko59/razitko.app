import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { getApiTranslator, getLocaleFromCookies } from "@/lib/i18n-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const t = await getApiTranslator();

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: t("errors.notLoggedIn") }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: t("errors.noSubscriptionToManage") },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${req.nextUrl.origin}/billing`,
      locale: getLocaleFromCookies(),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe billing portal session creation failed:", err);
    const message = err instanceof Error ? err.message : "Unknown error.";
    return NextResponse.json(
      { error: t("errors.portalCreateFailed", { message }) },
      { status: 500 },
    );
  }
}
