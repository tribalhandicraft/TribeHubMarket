
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

// Fix: Updated Gemini API service to strictly follow @google/genai guidelines
export const generateProductDescription = async (
  title: string, 
  category: string, 
  language: Language
): Promise<string> => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
      model: 'gemini-3-flash-preview', // Correct model for basic text tasks as per guidelines
      contents: prompt,
    });
    // Accessing text property directly (not calling as a method) as per guidelines
    return response.text?.trim() || "Description could not be generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description. Please try again.";
  }
};
