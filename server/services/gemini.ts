import { GoogleGenAI } from "@google/genai";
import { type InsertWord, type InsertQuizQuestion } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface GeneratedWordData {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  cefr: string;
  definition: string;
  synonyms: string[];
  antonyms: string[];
  examples: Array<{ english: string; arabic: string }>;
  dailyTip: string;
  quizQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

export async function generateDailyWord(date: string): Promise<{
  word: InsertWord;
  questions: InsertQuizQuestion[];
}> {
  const prompt = `Generate a powerful English word for date ${date}. The word should be educational and useful for English learners.

Please provide the following information in JSON format:
- word: the English word
- phonetic: IPA phonetic transcription
- partOfSpeech: noun, verb, adjective, etc.
- cefr: CEFR level (A1, A2, B1, B2, C1, C2)
- definition: clear, comprehensive definition
- synonyms: array of 3-5 synonyms
- antonyms: array of 2-4 antonyms
- examples: array of 3 usage examples, each with "english" and "arabic" translation
- dailyTip: a helpful tip about using this word (50-80 words)
- quizQuestions: array of 5 multiple-choice questions about the word, each with:
  - question: the question text
  - options: array of 4 answer options
  - correctAnswer: index (0-3) of the correct answer
  - explanation: explanation of why the answer is correct

Make the word deterministic for the given date - same date should always generate the same word.
Choose words that are practical and commonly used in professional, academic, or daily contexts.
Ensure Arabic translations are accurate and natural.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: "You are an expert English language teacher and vocabulary specialist. Always respond with valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            word: { type: "string" },
            phonetic: { type: "string" },
            partOfSpeech: { type: "string" },
            cefr: { type: "string" },
            definition: { type: "string" },
            synonyms: { 
              type: "array",
              items: { type: "string" }
            },
            antonyms: {
              type: "array",
              items: { type: "string" }
            },
            examples: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  english: { type: "string" },
                  arabic: { type: "string" }
                },
                required: ["english", "arabic"]
              }
            },
            dailyTip: { type: "string" },
            quizQuestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: {
                    type: "array",
                    items: { type: "string" }
                  },
                  correctAnswer: { type: "number" },
                  explanation: { type: "string" }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["word", "phonetic", "partOfSpeech", "cefr", "definition", "synonyms", "antonyms", "examples", "dailyTip", "quizQuestions"]
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini API");
    }

    const data: GeneratedWordData = JSON.parse(rawJson);
    
    // Validate the response
    if (!data.word || !data.definition || !data.examples || !data.quizQuestions) {
      throw new Error("Invalid response format from Gemini API");
    }

    const word: InsertWord = {
      word: data.word,
      phonetic: data.phonetic,
      partOfSpeech: data.partOfSpeech,
      cefr: data.cefr,
      definition: data.definition,
      synonyms: data.synonyms,
      antonyms: data.antonyms,
      examples: data.examples,
      dailyTip: data.dailyTip,
      date: date,
    };

    const questions: InsertQuizQuestion[] = data.quizQuestions.map(q => ({
      wordId: "", // Will be set after word is created
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

    return { word, questions };
  } catch (error) {
    console.error("Error generating word with Gemini:", error);
    throw new Error(`Failed to generate daily word: ${error}`);
  }
}
