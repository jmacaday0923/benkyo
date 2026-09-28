"use client";

import { useLocale, useTranslations, type Locale } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Each language is labelled in its own script, whatever the current UI language.
const localeNames: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
};

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")} className="flex items-center gap-1">
      {routing.locales.map((locale) => {
        const isCurrent = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            lang={locale}
            hrefLang={locale}
            aria-current={isCurrent ? "page" : undefined}
            className={buttonVariants({
              variant: isCurrent ? "secondary" : "ghost",
              size: "sm",
            })}
          >
            {localeNames[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
