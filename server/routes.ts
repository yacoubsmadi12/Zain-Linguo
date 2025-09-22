import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateDailyWord } from "./services/gemini";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get today's word
  app.get("/api/word/today", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Check if word already exists for today
      let word = await storage.getWordByDate(today);
      
      if (!word) {
        // Generate new word using Gemini AI
        const { word: insertWord, questions: insertQuestions } = await generateDailyWord(today);
        
        // Create the word
        word = await storage.createWord(insertWord);
        
        // Create quiz questions
        for (const questionData of insertQuestions) {
          questionData.wordId = word.id;
          await storage.createQuizQuestion(questionData);
        }
      }

      res.json(word);
    } catch (error) {
      console.error("Error fetching today's word:", error);
      res.status(500).json({ 
        message: "Failed to fetch today's word. Please check API configuration." 
      });
    }
  });

  // Get word with quiz questions
  app.get("/api/word/:id/quiz", async (req, res) => {
    try {
      const { id } = req.params;
      const wordWithQuestions = await storage.getWordWithQuestions(id);
      
      if (!wordWithQuestions) {
        return res.status(404).json({ message: "Word not found" });
      }

      res.json(wordWithQuestions);
    } catch (error) {
      console.error("Error fetching word quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz questions" });
    }
  });

  // Get word by date
  app.get("/api/word/date/:date", async (req, res) => {
    try {
      const { date } = req.params;
      
      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
      }

      let word = await storage.getWordByDate(date);
      
      if (!word) {
        // Generate word for the requested date if it doesn't exist
        const { word: insertWord, questions: insertQuestions } = await generateDailyWord(date);
        
        word = await storage.createWord(insertWord);
        
        for (const questionData of insertQuestions) {
          questionData.wordId = word.id;
          await storage.createQuizQuestion(questionData);
        }
      }

      res.json(word);
    } catch (error) {
      console.error("Error fetching word by date:", error);
      res.status(500).json({ message: "Failed to fetch word for the specified date" });
    }
  });

  // Get archive words with pagination
  app.get("/api/words/archive", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const offset = (page - 1) * limit;
      
      const words = await storage.getAllWords(limit, offset);
      
      res.json({
        words,
        pagination: {
          page,
          limit,
          hasMore: words.length === limit
        }
      });
    } catch (error) {
      console.error("Error fetching archive words:", error);
      res.status(500).json({ message: "Failed to fetch archive words" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      res.status(201).json({ 
        message: "Thank you for your message! We will get back to you soon.",
        id: submission.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: error.errors 
        });
      }
      
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
