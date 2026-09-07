import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { PLANS, type SubscriptionPlan } from "@/lib/plans";
import BillingClient from "@/components/BillingClient";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default async function BillingPage() {
  const t = await getTranslations("billing");
  const tSignup = await getTranslations("signup");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/billing");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan, documents_used_this_month, stripe_customer_id")
    .eq("id", user.id)
    .single();

  const plan = (profile?.subscription_plan as SubscriptionPlan) ?? "none";
  const planConfig = plan !== "none" ? PLANS[plan] : null;

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <div className="flex items-center justify-between">
        <Link href="/app" className="text-sm text-primary hover:underline">
          {t("back")}
        </Link>
        <LocaleSwitcher />
      </div>

      <h1 className="mt-4 text-2xl font-semibold text-foreground">{t("title")}</h1>

      <div className="mt-6 rounded-lg border border-border bg-card p-6">
        {planConfig ? (
          <>
            <p className="text-sm text-muted-foreground">{t("currentPlan")}</p>
            <p className="text-lg font-semibold text-foreground">
              {planConfig.name} — {tSignup("perMonth", { price: planConfig.priceEur })}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("usage", {
                used: profile?.documents_used_this_month ?? 0,
                limit: planConfig.monthlyLimit ?? "∞",
              })}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("noPlan")}{" "}
            <Link href="/pricing" className="text-primary hover:underline">
              {t("choosePlan")}
            </Link>
            .
          </p>
        )}

        {profile?.stripe_customer_id && (
          <div className="mt-6">
            <BillingClient />
          </div>
        )}
      </div>
    </main>
  );
}
