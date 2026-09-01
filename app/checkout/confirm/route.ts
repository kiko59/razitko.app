import { NextRequest, NextResponse } from "next/server";
import { syncProfileFromCheckoutSession } from "@/lib/subscription-sync";

export const runtime = "nodejs";

// Stripe Checkout's success_url points here (with the session id) instead
// of straight at /app. This runs the same sync the webhook does — directly
// against the Stripe API — and only *then* redirects to /app. That matters
// because /app requires an active plan: if we redirected there first and
// waited on the webhook, a slow or misconfigured webhook would bounce the
// user straight back to /pricing right after they paid.
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (sessionId) {
    try {
      await syncProfileFromCheckoutSession(sessionId);
    } catch (err) {
      console.error("Checkout confirm sync failed:", err);
    }
  }

  return NextResponse.redirect(new URL("/app?checkout=success", req.url));
}
