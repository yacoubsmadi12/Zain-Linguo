import { type Word, type InsertWord, type QuizQuestion, type InsertQuizQuestion, type ContactSubmission, type InsertContactSubmission, type WordWithQuestions, type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Word operations
  getWordByDate(date: string): Promise<Word | undefined>;
  createWord(word: InsertWord): Promise<Word>;
  getWordsByDateRange(startDate: string, endDate: string): Promise<Word[]>;
  getAllWords(limit?: number, offset?: number): Promise<Word[]>;
  getWordById(id: string): Promise<Word | undefined>;

  // Quiz operations
  getQuizQuestionsByWordId(wordId: string): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  getWordWithQuestions(wordId: string): Promise<WordWithQuestions | undefined>;

  // Contact operations
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;

  // Authentication operations - based on javascript_auth_all_persistance blueprint
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private words: Map<string, Word>;
  private quizQuestions: Map<string, QuizQuestion>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private users: Map<number, User>;
  private usersByUsername: Map<string, User>;
  private nextUserId: number;
  public sessionStore: session.Store;

  constructor() {
    this.words = new Map();
    this.quizQuestions = new Map();
    this.contactSubmissions = new Map();
    this.users = new Map();
    this.usersByUsername = new Map();
    this.nextUserId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getWordByDate(date: string): Promise<Word | undefined> {
    return Array.from(this.words.values()).find(word => word.date === date);
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    const id = randomUUID();
    const word: Word = {
      id,
      word: insertWord.word,
      phonetic: insertWord.phonetic,
      partOfSpeech: insertWord.partOfSpeech,
      cefr: insertWord.cefr,
      definition: insertWord.definition,
      synonyms: insertWord.synonyms as string[],
      antonyms: insertWord.antonyms as string[],
      examples: insertWord.examples as Array<{ english: string; arabic: string }>,
      dailyTip: insertWord.dailyTip,
      date: insertWord.date,
      createdAt: new Date(),
    };
    this.words.set(id, word);
    return word;
  }

  async getWordsByDateRange(startDate: string, endDate: string): Promise<Word[]> {
    return Array.from(this.words.values())
      .filter(word => word.date >= startDate && word.date <= endDate)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  async getAllWords(limit: number = 50, offset: number = 0): Promise<Word[]> {
    const allWords = Array.from(this.words.values())
      .sort((a, b) => b.date.localeCompare(a.date));
    
    return allWords.slice(offset, offset + limit);
  }

  async getWordById(id: string): Promise<Word | undefined> {
    return this.words.get(id);
  }

  async getQuizQuestionsByWordId(wordId: string): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values())
      .filter(question => question.wordId === wordId);
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = randomUUID();
    const question: QuizQuestion = {
      id,
      wordId: insertQuestion.wordId,
      question: insertQuestion.question,
      options: insertQuestion.options as string[],
      correctAnswer: insertQuestion.correctAnswer,
      explanation: insertQuestion.explanation,
    };
    this.quizQuestions.set(id, question);
    return question;
  }

  async getWordWithQuestions(wordId: string): Promise<WordWithQuestions | undefined> {
    const word = await this.getWordById(wordId);
    if (!word) return undefined;

    const questions = await this.getQuizQuestionsByWordId(wordId);
    return {
      ...word,
      questions,
    };
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  // Authentication methods - based on javascript_auth_all_persistance blueprint
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.usersByUsername.get(username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      department: insertUser.department,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    this.usersByUsername.set(insertUser.username, user);
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
}

export const storage = new MemStorage();
