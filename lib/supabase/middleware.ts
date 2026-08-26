import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// No auth required at all.
const PUBLIC_PATHS = ["/login", "/auth/callback", "/pricing", "/api/webhooks/stripe"];

// Auth required, but an active subscription plan is not — these are exactly
// the paths a signed-in user with plan 'none' needs to reach in order to
// ever get a plan in the first place (or manage a cancelled one).
const PLAN_EXEMPT_PATHS = ["/billing", "/api/stripe/checkout", "/api/stripe/portal"];

// Authenticates itself and must be reachable with either a Supabase session
// cookie (our own web UI) or an `Authorization: Bearer <api_key>` header
// (direct/external API calls, Fleet & Pro only) — see lib/subscription.ts.
// Middleware can't tell those apart from a cookie-only check, so it skips
// both the login gate and the plan gate here and leaves all of it to the
// route handler.
const SELF_AUTH_PATHS = ["/api/extract"];

function matchesPath(pathname: string, paths: string[]) {
  return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// Refreshes the Supabase session on every request and blocks access to
// everything except the public paths when the user isn't signed in. Page
// requests are redirected to /login; API requests get a 401 JSON response.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = matchesPath(pathname, PUBLIC_PATHS);
  const isSelfAuth = matchesPath(pathname, SELF_AUTH_PATHS);

  if (isSelfAuth) {
    return response;
  }

  if (!user && !isPublic) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Nie si prihlásený." }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (user && !isPublic && !matchesPath(pathname, PLAN_EXEMPT_PATHS)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan")
      .eq("id", user.id)
      .single();

    if (!profile || profile.subscription_plan === "none") {
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          {
            error: "Nemáš aktívne predplatné.",
            upgradeUrl: "/pricing",
          },
          { status: 402 },
        );
      }
      return NextResponse.redirect(new URL("/pricing", request.url));
    }
  }

  return response;
}
