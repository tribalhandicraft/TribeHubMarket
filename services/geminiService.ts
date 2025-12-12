import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

// Helper to get safe API key or throw descriptive error for demo
const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API Key missing");
    return "";
  }
  return key;
};

export const generateProductDescription = async (
  title: string, 
  category: string, 
  language: Language
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "AI service unavailable (Missing API Key).";

  const ai = new GoogleGenAI({ apiKey });

  const langMap = {
    en: "English",
    hi: "Hindi",
    mr: "Marathi"
  };

  const prompt = `
    You are an expert copywriter for traditional tribal products.
    Write a compelling, culturally rich, and attractive product description for a product titled "${title}" 
    which belongs to the category "${category}".
    
    The description should highlight:
    1. The traditional craftsmanship.
    2. Cultural significance.
    3. Natural materials if applicable.
    
    Write the response in ${langMap[language]} language.
    Keep it under 80 words.
    Do not use markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "Description could not be generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description. Please try again.";
  }
};
