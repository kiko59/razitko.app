import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import HomeClient from "@/components/HomeClient";
import { isPlanId } from "@/lib/plans";

export default async function AppPage() {
  const t = await getTranslations("app");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/app");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan, documents_used_this_month")
    .eq("id", user.id)
    .single();

  const plan = isPlanId(profile?.subscription_plan) ? profile.subscription_plan : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Header
        userEmail={user.email ?? null}
        plan={plan}
        documentsUsed={profile?.documents_used_this_month ?? 0}
      />
      <p className="mt-4 text-sm text-muted-foreground">{t("intro")}</p>

      <div className="mt-8">
        <HomeClient />
      </div>
    </main>
  );
}
