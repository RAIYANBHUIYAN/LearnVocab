import { words, type Word, type InsertWord, users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { and, asc, desc, eq, ilike, inArray } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Word-related methods
  getAllWords(): Promise<Word[]>;
  getWord(id: number): Promise<Word | undefined>;
  createWord(word: InsertWord): Promise<Word>;
  updateWord(id: number, word: Partial<InsertWord>): Promise<Word | undefined>;
  deleteWord(id: number): Promise<boolean>;
  searchWords(searchTerm: string): Promise<Word[]>;
  filterWordsByTag(tag: string): Promise<Word[]>;
}

export class DatabaseStorage implements IStorage {
  // User-related methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Word-related methods
  async getAllWords(): Promise<Word[]> {
    return db.select().from(words).orderBy(desc(words.dateLearned));
  }

  async getWord(id: number): Promise<Word | undefined> {
    const [word] = await db.select().from(words).where(eq(words.id, id));
    return word;
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    const [word] = await db.insert(words).values(insertWord).returning();
    return word;
  }

  async updateWord(id: number, updateData: Partial<InsertWord>): Promise<Word | undefined> {
    const [updatedWord] = await db
      .update(words)
      .set(updateData)
      .where(eq(words.id, id))
      .returning();
    
    return updatedWord;
  }

  async deleteWord(id: number): Promise<boolean> {
    const [deletedWord] = await db
      .delete(words)
      .where(eq(words.id, id))
      .returning({ id: words.id });
    
    return !!deletedWord;
  }

  async searchWords(searchTerm: string): Promise<Word[]> {
    if (!searchTerm) {
      return this.getAllWords();
    }
    
    return db
      .select()
      .from(words)
      .where(
        or(
          ilike(words.word, `%${searchTerm}%`),
          ilike(words.definition, `%${searchTerm}%`),
          ilike(words.example || '', `%${searchTerm}%`)
        )
      )
      .orderBy(desc(words.dateLearned));
  }

  async filterWordsByTag(tag: string): Promise<Word[]> {
    if (!tag) {
      return this.getAllWords();
    }
    
    // SQL query to filter by array containing tag
    return db
      .select()
      .from(words)
      .where(
        inArray(tag, words.tags)
      )
      .orderBy(desc(words.dateLearned));
  }
}

// Utility function to seed sample data
async function seedSampleData() {
  // Check if we already have words
  const existingWords = await db.select({ count: count() }).from(words);
  if (existingWords[0].count > 0) {
    console.log('Database already has words, skipping seed');
    return;
  }

  console.log('Seeding sample words...');
  
  const sampleWords: InsertWord[] = [
    {
      word: "Ephemeral",
      definition: "Lasting for a very short time; short-lived; transitory.",
      example: "The ephemeral nature of cherry blossoms makes them all the more appreciated.",
      tags: ["language", "philosophy"],
      dateLearned: new Date("2023-06-15"),
    },
    {
      word: "Eloquent",
      definition: "Fluent or persuasive in speaking or writing; having the power of expression.",
      example: "Her eloquent speech moved the audience to tears.",
      tags: ["language", "communication"],
      dateLearned: new Date("2023-06-17"),
    },
    {
      word: "Ubiquitous",
      definition: "Present, appearing, or found everywhere; omnipresent.",
      example: "Smartphones have become ubiquitous in modern society.",
      tags: ["tech", "language"],
      dateLearned: new Date("2023-06-20"),
    },
    {
      word: "Serendipity",
      definition: "The occurrence and development of events by chance in a happy or beneficial way.",
      example: "Finding this book was pure serendipity—I wasn't looking for it, but it's exactly what I needed.",
      tags: ["philosophy", "life"],
      dateLearned: new Date("2023-06-22"),
    },
    {
      word: "Algorithm",
      definition: "A process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.",
      example: "The search engine uses a complex algorithm to rank web pages.",
      tags: ["tech", "computer science"],
      dateLearned: new Date("2023-06-25"),
    },
    {
      word: "Pragmatic",
      definition: "Dealing with things sensibly and realistically in a way that is based on practical considerations.",
      example: "We need a pragmatic approach to solving this problem.",
      tags: ["philosophy", "business"],
      dateLearned: new Date("2023-06-27"),
    },
  ];

  try {
    await db.insert(words).values(sampleWords);
    console.log('Sample words seeded successfully');
  } catch (error) {
    console.error('Error seeding sample words:', error);
  }
}

export const storage = new DatabaseStorage();

// Import missing functions for database operations
import { or, count } from "drizzle-orm";

// Seed sample data if needed (this will run when this file is first loaded)
seedSampleData().catch(console.error);
