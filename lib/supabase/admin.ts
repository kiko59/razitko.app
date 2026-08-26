import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client that bypasses Row Level Security. Server-only, and only
// for code paths that must legitimately act across users: the Stripe webhook
// (updating a subscription it looked up by Stripe customer id, not by the
// caller's own auth.uid()) and the /api/extract quota check/increment.
// Never import this from a "use client" file or expose it to the browser.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY nie sú nastavené.",
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
