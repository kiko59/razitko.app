import { getTranslations } from "next-intl/server";

export default async function PricingFaq() {
  const t = await getTranslations("pricing.faq");
  const items = [1, 2, 3, 4].map((n) => ({
    question: t(`q${n}` as "q1"),
    answer: t(`a${n}` as "a1"),
  }));

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {items.map((item) => (
        <details key={item.question} className="group p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground">
            {item.question}
            <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
