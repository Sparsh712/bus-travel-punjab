import { GoogleGenAI, Type } from "@google/genai";
import { ROUTES } from '../constants';
import type { Route } from '../types';

const apiKey = "AIzaSyCqdkejgWQ088nNDLY2ae1lKk9woHVeyWc";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A friendly, concise summary of the travel advice. Use natural language. Address the user directly."
    },
    suggestedRouteId: {
      type: Type.STRING,
      description: "The 'id' of the most relevant route from the provided route data. If no single route is a perfect match, provide the ID of the best starting route or leave it empty."
    }
  }
};

export const getSmartTravelAdvice = async (query: string): Promise<{ summary: string; route?: Route }> => {
  try {
    const prompt = `
      You are a friendly and helpful AI assistant for the Punjab Public Transport system.
      Your goal is to help users plan their travel based on their questions.
      Use the provided route data to answer the query. Be concise and clear.

      Here is the available route data in JSON format:
      ${JSON.stringify(ROUTES)}

      User's query: "${query}"

      Based on the user's query and the available routes, provide a helpful summary and suggest the most relevant route ID.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);

    const summary = parsedResponse.summary || "I couldn't find a specific answer, but I'm here to help!";
    const routeId = parsedResponse.suggestedRouteId;
    
    const suggestedRoute = ROUTES.find(r => r.id === routeId);

    return {
      summary,
      route: suggestedRoute,
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      summary: "I'm having a little trouble connecting right now. Please try again in a moment.",
    };
  }
};