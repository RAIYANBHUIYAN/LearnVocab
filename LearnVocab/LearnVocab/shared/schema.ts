import { pgTable, text, serial, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  word: text("word").notNull(),
  definition: text("definition").notNull(),
  example: text("example"),
  tags: text("tags").array(),
  dateLearned: date("date_learned").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWordSchema = createInsertSchema(words).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWord = z.infer<typeof insertWordSchema>;
export type Word = typeof words.$inferSelect;

// Extended schema with validation for frontend form
export const wordFormSchema = insertWordSchema.extend({
  word: z.string().min(1, "Word is required"),
  definition: z.string().min(1, "Definition is required"),
  example: z.string().optional(),
  tags: z.array(z.string()).default([]),
  dateLearned: z.date().default(() => new Date()),
});

export type WordFormValues = z.infer<typeof wordFormSchema>;
