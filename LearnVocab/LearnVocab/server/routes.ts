import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWordSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Words API endpoints
  
  // GET /api/words - Get all words
  app.get("/api/words", async (req: Request, res: Response) => {
    try {
      let words;
      
      // Handle search query parameter
      if (req.query.search) {
        const searchTerm = String(req.query.search);
        words = await storage.searchWords(searchTerm);
      }
      // Handle tag filter query parameter
      else if (req.query.tag) {
        const tag = String(req.query.tag);
        words = await storage.filterWordsByTag(tag);
      }
      // Return all words if no filters
      else {
        words = await storage.getAllWords();
      }
      
      res.json(words);
    } catch (error) {
      console.error("Error fetching words:", error);
      res.status(500).json({ message: "Failed to fetch words" });
    }
  });

  // GET /api/words/:id - Get word by ID
  app.get("/api/words/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const word = await storage.getWord(id);
      if (!word) {
        return res.status(404).json({ message: "Word not found" });
      }

      res.json(word);
    } catch (error) {
      console.error("Error fetching word:", error);
      res.status(500).json({ message: "Failed to fetch word" });
    }
  });

  // POST /api/words - Create a new word
  app.post("/api/words", async (req: Request, res: Response) => {
    try {
      // Validate request body against schema
      const validationResult = insertWordSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid word data", 
          errors: validationResult.error.format() 
        });
      }

      const wordData = validationResult.data;
      const newWord = await storage.createWord(wordData);
      
      res.status(201).json(newWord);
    } catch (error) {
      console.error("Error creating word:", error);
      res.status(500).json({ message: "Failed to create word" });
    }
  });

  // PUT /api/words/:id - Update a word
  app.put("/api/words/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      // Check if the word exists
      const existingWord = await storage.getWord(id);
      if (!existingWord) {
        return res.status(404).json({ message: "Word not found" });
      }

      // Validate request body against schema
      const validationResult = insertWordSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid word data", 
          errors: validationResult.error.format() 
        });
      }

      const wordData = validationResult.data;
      const updatedWord = await storage.updateWord(id, wordData);
      
      res.json(updatedWord);
    } catch (error) {
      console.error("Error updating word:", error);
      res.status(500).json({ message: "Failed to update word" });
    }
  });

  // DELETE /api/words/:id - Delete a word
  app.delete("/api/words/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      // Check if the word exists
      const existingWord = await storage.getWord(id);
      if (!existingWord) {
        return res.status(404).json({ message: "Word not found" });
      }

      const success = await storage.deleteWord(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete word" });
      }
    } catch (error) {
      console.error("Error deleting word:", error);
      res.status(500).json({ message: "Failed to delete word" });
    }
  });

  // GET /api/tags - Get all unique tags
  app.get("/api/tags", async (req: Request, res: Response) => {
    try {
      const words = await storage.getAllWords();
      
      // Extract all tags and create a unique set
      const tags = new Set<string>();
      words.forEach(word => {
        if (word.tags && Array.isArray(word.tags)) {
          word.tags.forEach(tag => tags.add(tag));
        }
      });
      
      res.json(Array.from(tags));
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
