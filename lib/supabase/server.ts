import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "documents";

// Per-request Supabase client for Server Components, Route Handlers and
// Server Actions. It forwards the signed-in user's session (from cookies)
// on every call, so Row Level Security policies apply — this client never
// bypasses RLS. Create a fresh instance per request; never share/cache it.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where cookies can't be
            // written. Safe to ignore — middleware refreshes the session
            // on every navigation.
          }
        },
      },
    },
  );
}
