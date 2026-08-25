import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Header userEmail={user.email ?? null} />
      <p className="mt-4 text-sm text-slate-600">
        Nahraj prepravný dokument (CMR, BOL, dodací list) a automaticky z
        neho vyťaž kľúčové údaje.
      </p>

      <div className="mt-8">
        <HomeClient />
      </div>
    </main>
  );
}
