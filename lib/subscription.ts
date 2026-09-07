import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getApiTranslator } from "@/lib/i18n-server";
import { PLANS, type SubscriptionPlan, type PlanId } from "@/lib/plans";

export interface ApiCaller {
  userId: string;
  plan: SubscriptionPlan;
  viaApiKey: boolean;
}

// Resolves who's calling /api/extract and how:
// - `Authorization: Bearer <api_key>` — a direct/external API call. Only
//   Fleet and Pro plans may authenticate this way (requirement: no direct
//   API access on Solo).
// - Supabase session cookie — a call from our own web UI. Allowed on any
//   active plan; middleware already keeps plan:'none' users out, but we
//   re-check here since this function needs the plan value regardless.
export async function resolveApiCaller(
  req: NextRequest,
): Promise<ApiCaller | { error: NextResponse }> {
  const t = await getApiTranslator();
  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const apiKey = authHeader.slice("Bearer ".length).trim();
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("id, subscription_plan")
      .eq("api_key", apiKey)
      .single();

    if (!profile) {
      return {
        error: NextResponse.json({ error: t("errors.invalidApiKey") }, { status: 401 }),
      };
    }

    const plan = profile.subscription_plan as SubscriptionPlan;
    if (plan !== "fleet" && plan !== "pro") {
      return {
        error: NextResponse.json(
          { error: t("errors.apiFleetProOnly"), upgradeUrl: "/pricing" },
          { status: 403 },
        ),
      };
    }

    return { userId: profile.id, plan, viaApiKey: true };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: t("errors.notLoggedIn") }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", user.id)
    .single();

  return {
    userId: user.id,
    plan: (profile?.subscription_plan as SubscriptionPlan) ?? "none",
    viaApiKey: false,
  };
}

// Returns an error response if the caller has no active plan or already hit
// their monthly quota; otherwise null.
export async function enforceMonthlyLimit(
  userId: string,
  plan: SubscriptionPlan,
): Promise<NextResponse | null> {
  const t = await getApiTranslator();

  if (plan === "none") {
    return NextResponse.json(
      { error: t("errors.noSubscription"), upgradeUrl: "/pricing" },
      { status: 402 },
    );
  }

  const limit = PLANS[plan as PlanId].monthlyLimit;
  if (limit === null) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("documents_used_this_month")
    .eq("id", userId)
    .single();

  const used = profile?.documents_used_this_month ?? 0;
  if (used >= limit) {
    return NextResponse.json(
      { error: t("errors.limitReached"), upgradeUrl: "/pricing" },
      { status: 402 },
    );
  }

  return null;
}

export async function incrementDocumentUsage(userId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.rpc("increment_document_usage", { p_user_id: userId });
  if (error) console.error("increment_document_usage failed:", error);
}
