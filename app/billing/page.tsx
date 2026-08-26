import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PLANS, type SubscriptionPlan } from "@/lib/plans";
import BillingClient from "@/components/BillingClient";

export default async function BillingPage() {
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
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Späť do appky
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Predplatné</h1>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        {planConfig ? (
          <>
            <p className="text-sm text-slate-500">Aktuálny plán</p>
            <p className="text-lg font-semibold text-slate-900">
              {planConfig.name} — {planConfig.priceEur} € / mesiac
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {profile?.documents_used_this_month ?? 0} /{" "}
              {planConfig.monthlyLimit ?? "∞"} dokumentov využitých tento mesiac
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-600">
            Nemáš aktívne predplatné.{" "}
            <Link href="/pricing" className="text-blue-600 hover:underline">
              Vyber si plán
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
