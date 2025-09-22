import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const words = pgTable("words", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  word: text("word").notNull(),
  phonetic: text("phonetic").notNull(),
  partOfSpeech: text("part_of_speech").notNull(),
  cefr: text("cefr").notNull(),
  definition: text("definition").notNull(),
  synonyms: jsonb("synonyms").$type<string[]>().notNull(),
  antonyms: jsonb("antonyms").$type<string[]>().notNull(),
  examples: jsonb("examples").$type<Array<{ english: string; arabic: string }>>().notNull(),
  dailyTip: text("daily_tip").notNull(),
  date: text("date").notNull().unique(), // YYYY-MM-DD format
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  wordId: varchar("word_id").references(() => words.id).notNull(),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(), // 0-based index
  explanation: text("explanation").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertWordSchema = createInsertSchema(words).omit({
  id: true,
  createdAt: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export type Word = typeof words.$inferSelect;
export type InsertWord = z.infer<typeof insertWordSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

// Frontend-specific types for user progress (stored in localStorage)
export interface UserProgress {
  streak: number;
  totalWords: number;
  averageScore: number;
  lastVisit: string;
  achievements: string[];
  quizScores: Record<string, number>; // wordId -> score
}

export interface WordWithQuestions extends Word {
  questions: QuizQuestion[];
}
