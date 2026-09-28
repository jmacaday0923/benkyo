import { connection } from "next/server";
import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { db } from "@/db";
import { decks } from "@/db/schema";

export default async function HomePage() {
  // The deck count is live data, so render on every request instead of at build time.
  await connection();

  const [t, deckCount] = await Promise.all([
    getTranslations("HomePage"),
    db.$count(decks),
  ]);

  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-6">
          <span className="font-semibold tracking-tight">{t("title")}</span>
          <LocaleSwitcher />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-10 px-6 py-16">
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h1 className="text-5xl font-semibold tracking-tight">
            {t("title")}{" "}
            <span lang="ja" className="text-muted-foreground">
              勉強
            </span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {t("tagline")}
          </p>
        </div>

        <section
          aria-labelledby="deck-count-label"
          className="w-fit min-w-56 rounded-xl border bg-card p-6 text-card-foreground"
        >
          <h2
            id="deck-count-label"
            className="text-sm font-medium text-muted-foreground"
          >
            {t("deckCountLabel")}
          </h2>
          <p className="mt-2 text-4xl font-semibold tabular-nums">
            {deckCount}
          </p>
        </section>
      </main>
    </>
  );
}
