import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { hasLocale, type Locale, type Messages } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

// Typed per locale, so a missing key in any translation file fails the type check.
const loadMessages: Record<Locale, () => Promise<Messages>> = {
  en: async () => (await import("../../messages/en.json")).default,
  ja: async () => (await import("../../messages/ja.json")).default,
};

export default getRequestConfig(async ({ locale }) => {
  // `locale` is only provided when passed explicitly, e.g. getTranslations({ locale }).
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (!hasLocale(routing.locales, paramValue)) notFound();
    locale = paramValue;
  }

  return {
    locale,
    messages: await loadMessages[locale](),
  };
});
