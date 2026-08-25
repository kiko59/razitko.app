import { signOutAction } from "@/app/actions";

interface HeaderProps {
  userEmail: string | null;
}

export default function Header({ userEmail }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 pb-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Razítko</h1>
        {userEmail && <p className="text-xs text-slate-500">{userEmail}</p>}
      </div>
      <form action={signOutAction}>
        <button
          type="submit"
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Odhlásiť sa
        </button>
      </form>
    </header>
  );
}
