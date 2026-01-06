
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistantResponse = async (userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: `You are Fixa Assistant, a helpful AI within a local service marketplace app in Kenya. 
        Your goal is to help users diagnose their home problems (plumbing, electrical, etc.) and suggest the right category 
        of service provider to hire. Be concise, friendly, and practical. 
        If a user describes a problem, suggest which category they need (Plumbing, Electrical, Cleaning, Carpentry, Mechanic, Painting, AC Repair, Saloon).`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again or browse our categories manually.";
  }
};

export const getSmartSearchSuggestions = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User search query: "${query}". Based on this, suggest 3 relevant service categories from: Plumbing, Electrical, Cleaning, Carpentry, Mechanic, Painting, AC Repair, Saloon.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    return [];
  }
};
