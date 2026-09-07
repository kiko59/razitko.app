import { getTranslations } from "next-intl/server";
import { PLAN_ORDER, PLANS } from "@/lib/plans";

export default async function PricingComparison() {
  const t = await getTranslations("pricing");

  const rows: { label: string; value: (planId: (typeof PLAN_ORDER)[number]) => string }[] = [
    {
      label: t("comparison.rowVolume"),
      value: (id) => {
        const limit = PLANS[id].monthlyLimit;
        return limit === null ? t("comparison.unlimited") : String(limit);
      },
    },
    {
      label: t("comparison.rowLanguages"),
      value: (id) =>
        id === "pro"
          ? t("comparison.allLanguages")
          : t(`plans.${id}.languages` as Parameters<typeof t>[0]),
    },
    {
      label: t("comparison.rowApi"),
      value: (id) => (PLANS[id].apiAccess ? t("comparison.apiYes") : t("comparison.apiNo")),
    },
    {
      label: t("comparison.rowSeats"),
      value: (id) => String(PLANS[id].seats),
    },
    {
      label: t("comparison.rowSupport"),
      value: (id) => t(`plans.${id}.support` as Parameters<typeof t>[0]),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="p-4 text-left font-medium text-muted-foreground">
              {t("comparison.feature")}
            </th>
            {PLAN_ORDER.map((id) => (
              <th key={id} className="p-4 text-left font-semibold text-foreground">
                {PLANS[id].name}
                <span className="ml-2 font-normal text-muted-foreground">
                  {PLANS[id].priceEur} €
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <td className="p-4 text-muted-foreground">{row.label}</td>
              {PLAN_ORDER.map((id) => (
                <td key={id} className="p-4 text-foreground">
                  {row.value(id)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
