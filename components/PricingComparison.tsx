import { PLAN_ORDER, PLANS } from "@/lib/plans";

const ROWS: { label: string; value: (planId: (typeof PLAN_ORDER)[number]) => string }[] = [
  {
    label: "CMR objem (mesačne)",
    value: (id) => {
      const limit = PLANS[id].monthlyLimit;
      return limit === null ? "Neobmedzene" : String(limit);
    },
  },
  {
    label: "Podporované jazyky",
    value: (id) => PLANS[id].languages.join(" · "),
  },
  {
    label: "API prístup",
    value: (id) => (PLANS[id].apiAccess ? "REST API" : "Nie"),
  },
  {
    label: "Dashboard sedadlá",
    value: (id) => String(PLANS[id].seats),
  },
  {
    label: "Support",
    value: (id) => PLANS[id].support,
  },
];

export default function PricingComparison() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="p-4 text-left font-medium text-muted-foreground">Vlastnosť</th>
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
          {ROWS.map((row) => (
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
