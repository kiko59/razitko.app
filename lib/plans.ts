export type PlanId = "solo" | "fleet" | "pro";
export type SubscriptionPlan = PlanId | "none";

export interface PlanConfig {
  id: PlanId;
  name: string;
  priceEur: number;
  priceId: string | undefined;
  monthlyLimit: number | null;
  apiAccess: boolean;
  seats: number;
}

// Display copy (trucks, support, feature bullets) lives in messages/*.json
// under pricing.plans.<id> — keyed the same as this object so components
// can pair a plan's functional data with its translated text.
export const PLANS: Record<PlanId, PlanConfig> = {
  solo: {
    id: "solo",
    name: "Solo",
    priceEur: 49,
    priceId: process.env.STRIPE_PRICE_SOLO?.trim(),
    monthlyLimit: 60,
    apiAccess: false,
    seats: 1,
  },
  fleet: {
    id: "fleet",
    name: "Fleet",
    priceEur: 149,
    priceId: process.env.STRIPE_PRICE_FLEET?.trim(),
    monthlyLimit: 250,
    apiAccess: true,
    seats: 5,
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceEur: 300,
    priceId: process.env.STRIPE_PRICE_PRO?.trim(),
    monthlyLimit: null,
    apiAccess: true,
    seats: 10,
  },
};

export const PLAN_ORDER: PlanId[] = ["solo", "fleet", "pro"];

export function isPlanId(value: string | null | undefined): value is PlanId {
  return value === "solo" || value === "fleet" || value === "pro";
}

export function planFromPriceId(priceId: string | null | undefined): PlanId | null {
  if (!priceId) return null;
  for (const plan of Object.values(PLANS)) {
    if (plan.priceId === priceId) return plan.id;
  }
  return null;
}
