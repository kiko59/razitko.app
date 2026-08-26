import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { PLANS, type PlanId } from "@/lib/plans";

interface HeaderProps {
  userEmail: string | null;
  plan: PlanId | null;
  documentsUsed: number;
}

export default function Header({ userEmail, plan, documentsUsed }: HeaderProps) {
  const planConfig = plan ? PLANS[plan] : null;

  return (
    <header className="flex items-center justify-between border-b border-slate-200 pb-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Razítko</h1>
        {userEmail && <p className="text-xs text-slate-500">{userEmail}</p>}
      </div>
      <div className="flex items-center gap-4">
        {planConfig && (
          <Link href="/billing" className="text-right text-xs text-slate-600 hover:underline">
            <span className="block font-medium text-slate-900">{planConfig.name}</span>
            <span>
              {documentsUsed}/{planConfig.monthlyLimit ?? "∞"} dokumentov tento mesiac
            </span>
          </Link>
        )}
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Odhlásiť sa
          </button>
        </form>
      </div>
    </header>
  );
}
