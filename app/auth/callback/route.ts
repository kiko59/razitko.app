import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles the confirmation link Supabase emails after sign-up (PKCE code
// exchange), then sends the user on to the app.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const redirectTo = request.nextUrl.searchParams.get("redirectTo") || "/app";

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
