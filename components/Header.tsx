import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { signOutAction } from "@/app/actions";
import { PLANS, type PlanId } from "@/lib/plans";
import LocaleSwitcher from "@/components/LocaleSwitcher";

interface HeaderProps {
  userEmail: string | null;
  plan: PlanId | null;
  documentsUsed: number;
}

export default async function Header({ userEmail, plan, documentsUsed }: HeaderProps) {
  const t = await getTranslations("header");
  const planConfig = plan ? PLANS[plan] : null;

  return (
    <header className="flex items-center justify-between border-b border-border pb-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Razítko</h1>
        {userEmail && <p className="text-xs text-muted-foreground">{userEmail}</p>}
      </div>
      <div className="flex items-center gap-4">
        <LocaleSwitcher />
        {planConfig && (
          <Link href="/billing" className="text-right text-xs text-muted-foreground hover:underline">
            <span className="block font-medium text-foreground">{planConfig.name}</span>
            <span>
              {t("usage", { used: documentsUsed, limit: planConfig.monthlyLimit ?? "∞" })}
            </span>
          </Link>
        )}
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-md border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-accent"
          >
            {t("signOut")}
          </button>
        </form>
      </div>
    </header>
  );
}
