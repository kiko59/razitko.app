import { cookies } from "next/headers";
import { createTranslator } from "next-intl";
import { resolveLocale, type Locale } from "@/i18n/config";

export function getLocaleFromCookies(): Locale {
  return resolveLocale(cookies().get("NEXT_LOCALE")?.value);
}

// For Route Handlers, which sit outside the React tree next-intl's
// `getTranslations()` relies on — this loads the same message files
// directly, keyed off the same NEXT_LOCALE cookie the pages use.
export async function getApiTranslator() {
  const locale = getLocaleFromCookies();
  const messages = (await import(`../messages/${locale}.json`)).default;
  return createTranslator({ locale, messages });
}
