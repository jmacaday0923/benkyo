import { eq } from "drizzle-orm";

import { db } from "./index";
import { cards, decks, users } from "./schema";

type NewCard = typeof cards.$inferInsert;

const DEMO_USER_EMAIL = "demo@example.com";

const n5Vocabulary: Pick<NewCard, "kanji" | "reading" | "meaning">[] = [
  { kanji: "学生", reading: "がくせい", meaning: "student" },
  { kanji: "先生", reading: "せんせい", meaning: "teacher" },
  { kanji: "友達", reading: "ともだち", meaning: "friend" },
  { kanji: "水", reading: "みず", meaning: "water" },
  { kanji: "本", reading: "ほん", meaning: "book" },
  { kanji: "日本語", reading: "にほんご", meaning: "Japanese (language)" },
  { kanji: "今日", reading: "きょう", meaning: "today" },
  { kanji: "食べる", reading: "たべる", meaning: "to eat" },
  { kanji: "飲む", reading: "のむ", meaning: "to drink" },
  { kanji: "大きい", reading: "おおきい", meaning: "big" },
];

async function seed() {
  await db.transaction(async (tx) => {
    // Start from a clean slate so the script can be re-run safely.
    // Deleting the demo user also removes its decks and cards (ON DELETE CASCADE).
    await tx.delete(users).where(eq(users.email, DEMO_USER_EMAIL));

    const [user] = await tx
      .insert(users)
      .values({ email: DEMO_USER_EMAIL, name: "Demo Learner" })
      .returning({ id: users.id });
    if (!user) throw new Error("Failed to create the demo user.");

    const [deck] = await tx
      .insert(decks)
      .values({
        userId: user.id,
        name: "JLPT N5 Vocabulary",
        description: "Common words from the JLPT N5 level.",
      })
      .returning({ id: decks.id });
    if (!deck) throw new Error("Failed to create the demo deck.");

    await tx.insert(cards).values(
      n5Vocabulary.map((card): NewCard => ({
        ...card,
        deckId: deck.id,
        type: "vocab",
        jlptLevel: "N5",
      })),
    );
  });

  console.log(
    `Seeded 1 deck with ${n5Vocabulary.length} N5 vocabulary cards for ${DEMO_USER_EMAIL}.`,
  );
}

seed()
  .catch((error: unknown) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => db.$client.end());
