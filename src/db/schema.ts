import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const jlptLevelEnum = pgEnum("jlpt_level", [
  "N5",
  "N4",
  "N3",
  "N2",
  "N1",
]);

export const cardTypeEnum = pgEnum("card_type", ["vocab", "kanji"]);

/** Time-ordered UUID primary key; uuidv7() is built into Postgres 18. */
const id = () =>
  uuid()
    .primaryKey()
    .default(sql`uuidv7()`);

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: id(),
  email: text().notNull().unique(),
  name: text(),
  ...timestamps,
});

export const decks = pgTable(
  "decks",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text().notNull(),
    description: text(),
    ...timestamps,
  },
  (table) => [index("decks_user_id_idx").on(table.userId)],
);

export const cards = pgTable(
  "cards",
  {
    id: id(),
    deckId: uuid()
      .notNull()
      .references(() => decks.id, { onDelete: "cascade" }),
    type: cardTypeEnum().notNull().default("vocab"),
    /** Written form with kanji, e.g. 食べる; null for kana-only words such as テレビ. */
    kanji: text(),
    /** Reading in kana, e.g. たべる. */
    reading: text().notNull(),
    meaning: text().notNull(),
    jlptLevel: jlptLevelEnum(),
    ...timestamps,
  },
  (table) => [
    index("cards_deck_id_idx").on(table.deckId),
    check(
      "cards_kanji_required_for_kanji_cards",
      sql`${table.type} <> 'kanji' or ${table.kanji} is not null`,
    ),
  ],
);

/**
 * Spaced repetition (SM-2) state for one user and one card: when the card is
 * next due, plus the values needed to schedule the review after that.
 */
export const reviews = pgTable(
  "reviews",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cardId: uuid()
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    dueAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    intervalDays: integer().notNull().default(0),
    easeFactor: real().notNull().default(2.5),
    repetitions: integer().notNull().default(0),
    lastReviewedAt: timestamp({ withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("reviews_user_id_card_id_idx").on(table.userId, table.cardId),
    index("reviews_user_id_due_at_idx").on(table.userId, table.dueAt),
    check("reviews_ease_factor_min", sql`${table.easeFactor} >= 1.3`),
    check(
      "reviews_interval_days_non_negative",
      sql`${table.intervalDays} >= 0`,
    ),
    check("reviews_repetitions_non_negative", sql`${table.repetitions} >= 0`),
  ],
);
