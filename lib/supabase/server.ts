import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "documents";

// Server-only client using the service role key. Never import this file
// from client components.
export function supabaseServer() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
