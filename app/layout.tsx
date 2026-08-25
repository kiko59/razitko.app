import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Razítko — spracovanie prepravných dokumentov",
  description:
    "Nahraj CMR, BOL alebo dodací list a automaticky z neho vyťaž dáta.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
