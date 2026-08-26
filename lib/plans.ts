export type PlanId = "solo" | "fleet" | "pro";
export type SubscriptionPlan = PlanId | "none";

export interface PlanConfig {
  id: PlanId;
  name: string;
  priceEur: number;
  priceId: string | undefined;
  trucks: string;
  monthlyLimit: number | null;
  apiAccess: boolean;
  seats: number;
  languages: string[];
  support: string;
  features: string[];
}

export const PLANS: Record<PlanId, PlanConfig> = {
  solo: {
    id: "solo",
    name: "Solo",
    priceEur: 49,
    priceId: process.env.STRIPE_PRICE_SOLO,
    trucks: "1 kamión",
    monthlyLimit: 60,
    apiAccess: false,
    seats: 1,
    languages: ["SK", "CZ", "EN"],
    support: "Email, best-effort",
    features: [
      "1 kamión",
      "60 CMR extrakcií / mesiac",
      "Jazyky: SK, CZ, EN",
      "Bez API prístupu",
      "1 používateľské sedadlo",
      "Support: email, best-effort",
    ],
  },
  fleet: {
    id: "fleet",
    name: "Fleet",
    priceEur: 149,
    priceId: process.env.STRIPE_PRICE_FLEET,
    trucks: "2–5 kamiónov",
    monthlyLimit: 250,
    apiAccess: true,
    seats: 5,
    languages: ["SK", "CZ", "EN", "DE", "FR"],
    support: "Email, odpoveď do 24h",
    features: [
      "2–5 kamiónov",
      "250 CMR extrakcií / mesiac",
      "Jazyky: SK, CZ, EN, DE, FR",
      "REST API ako voliteľný add-on (60 req/min)",
      "5 používateľských sedadiel",
      "Support: email, odpoveď do 24h",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceEur: 300,
    priceId: process.env.STRIPE_PRICE_PRO,
    trucks: "6–10 kamiónov",
    monthlyLimit: null,
    apiAccess: true,
    seats: 10,
    languages: ["Všetky jazyky"],
    support: "Dedikovaný kontakt + onboarding",
    features: [
      "6–10 kamiónov",
      "Neobmedzený počet extrakcií",
      "Všetky jazyky + early-access k novým funkciám",
      "REST API + webhooky, HMAC podpis, 300 req/min",
      "10 používateľských sedadiel",
      "Support: dedikovaný kontakt + onboarding",
    ],
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
