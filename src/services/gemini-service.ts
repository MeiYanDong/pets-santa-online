"use server";

import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || '';

export const generatePetPortrait = async (base64Image: string, prompt: string): Promise<string | null> => {
  if (!API_KEY) {
    console.error("API key is missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1], // Strip data:image/png;base64,
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    const candidates = (response as any).candidates;
    if (!candidates || candidates.length === 0) return null;

    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
