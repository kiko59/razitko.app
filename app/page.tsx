import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import HomeClient from "@/components/HomeClient";
import { isPlanId } from "@/lib/plans";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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
      <p className="mt-4 text-sm text-muted-foreground">
        Nahraj prepravný dokument (CMR, BOL, dodací list) a automaticky z
        neho vyťaž kľúčové údaje.
      </p>

      <div className="mt-8">
        <HomeClient />
      </div>
    </main>
  );
}
