import { Translation, Locale } from "../types";

// Picks the translation for the current locale, falling back to Russian, then any available.
export function pickTranslation<T extends Translation>(
  translations: T[],
  locale: Locale
): T | undefined {
  return (
    translations.find((t) => t.locale === locale) ||
    translations.find((t) => t.locale === "ru") ||
    translations[0]
  );
}
