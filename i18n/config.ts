export const LOCALES = ["sk", "en", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "sk";

export const LOCALE_LABELS: Record<Locale, string> = {
  sk: "SK",
  en: "EN",
  de: "DE",
};

export function resolveLocale(value: string | undefined | null): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
}
