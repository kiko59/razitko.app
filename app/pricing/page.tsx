import { createClient } from "@/lib/supabase/server";
import PricingCards from "@/components/PricingCards";
import type { SubscriptionPlan } from "@/lib/plans";

export default async function PricingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentPlan: SubscriptionPlan | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan")
      .eq("id", user.id)
      .single();
    currentPlan = (profile?.subscription_plan as SubscriptionPlan) ?? "none";
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Cenník</h1>
        <p className="mt-2 text-sm text-slate-600">
          Vyber si plán podľa veľkosti tvojej flotily. Kedykoľvek môžeš zmeniť
          alebo zrušiť.
        </p>
      </div>

      <div className="mt-10">
        <PricingCards isLoggedIn={!!user} currentPlan={currentPlan} />
      </div>
    </main>
  );
}
