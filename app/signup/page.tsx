import { createClient } from "@/lib/supabase/server";
import SignupForm from "@/components/SignupForm";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { isPlanId, type PlanId } from "@/lib/plans";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { tier?: string };
}) {
  const initialTier: PlanId = isPlanId(searchParams.tier) ? searchParams.tier : "solo";

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-16">
      <div className="mb-4 flex justify-end">
        <LocaleSwitcher />
      </div>
      <SignupForm
        initialTier={initialTier}
        isLoggedIn={!!user}
        userEmail={user?.email ?? null}
      />
    </main>
  );
}
