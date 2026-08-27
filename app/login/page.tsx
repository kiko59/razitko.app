"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nastala neznáma chyba.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-10">
      <div className="rounded-lg border border-border bg-card p-8">
        <h1 className="text-xl font-semibold text-foreground">Vitaj späť</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Prihlás sa do svojho účtu a pokračuj.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-foreground">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-foreground">Heslo</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Chvíľu strpenia…" : "Prihlásiť sa"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Nemáš účet?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Vytvor si ho
          </Link>
        </p>
      </div>
    </main>
  );
}
