import { GoogleGenerativeAI } from "@google/generative-ai";
import { ROUTES } from '../constants';
import type { Route } from '../types';

const apiKey = import.meta.env.VITE_API_KEY;

// This check provides a clear error if the API key is missing.
if (!apiKey) {
  throw new Error("VITE_API_KEY is not set. Please add it to your .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);

// --- Define intents and topics for classification (no changes here) ---
export enum Intent {
  TRAVEL_QUERY = 'TRAVEL_QUERY',
  APP_NAVIGATION = 'APP_NAVIGATION',
  UNKNOWN = 'UNKNOWN',
}

export enum AppNavigationTopic {
  CHANGE_LANGUAGE = 'CHANGE_LANGUAGE',
  VIEW_PROFILE = 'VIEW_PROFILE',
  CONTACT_SUPPORT = 'CONTACT_SUPPORT',
  GO_TO_SETTINGS = 'GO_TO_SETTINGS',
}

export const appNavigationResponses = new Map<AppNavigationTopic, string>([
  [AppNavigationTopic.CHANGE_LANGUAGE, "To change the language, please go to the Settings page. You'll find the language options there."],
  [AppNavigationTopic.VIEW_PROFILE, "You can find your profile information on the Settings page."],
  [AppNavigationTopic.CONTACT_SUPPORT, "For assistance, please visit the 'Settings' page and look for the 'Contact Support' option."],
  [AppNavigationTopic.GO_TO_SETTINGS, "Navigating you to the Settings page now!"]
]);


// --- CORRECTED: AI-powered function to classify user intent ---
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  generationConfig: {
    responseMimeType: "application/json",
  }
});

export const classifyUserIntent = async (query: string): Promise<{ intent: Intent; topic?: AppNavigationTopic }> => {
    try {
        const prompt = `
            You are an intent classifier for a public transport app. Your job is to understand what the user wants to do.
            Categorize the user's query into one of the following intents: ${Object.values(Intent).join(', ')}.

            - Use TRAVEL_QUERY for any questions about bus routes, travel times, destinations, or planning a trip.
            - Use APP_NAVIGATION for questions about using the app itself, like changing settings, finding a profile, or asking to be taken to a specific page.

            If the intent is APP_NAVIGATION, you must also identify the specific topic from this list: ${Object.values(AppNavigationTopic).join(', ')}.
            - Use GO_TO_SETTINGS if the user explicitly asks to "go to settings".

            User's query: "${query}"

            Provide your response as a JSON object with two keys: "intent" and "topic" (if applicable).
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const parsedResponse = JSON.parse(response.text());
        
        if (Object.values(Intent).includes(parsedResponse.intent)) {
             return {
                intent: parsedResponse.intent as Intent,
                topic: parsedResponse.topic as AppNavigationTopic | undefined
             };
        }
        return { intent: Intent.UNKNOWN };

    } catch (error) {
        console.error("Error classifying intent:", error);
        // If classification fails, assume it's a travel query to be safe.
        return { intent: Intent.TRAVEL_QUERY };
    }
};


// --- CORRECTED: Your function for getting travel advice ---
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
      Your response must be a JSON object with two keys: "summary" (a string) and "suggestedRouteId" (a string, which can be empty).
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const parsedResponse = JSON.parse(response.text());

    const summary = parsedResponse.summary || "I couldn't find a specific answer, but I'm here to help!";
    const routeId = parsedResponse.suggestedRouteId;
    
    const suggestedRoute = routeId ? ROUTES.find(r => r.id === routeId) : undefined;

    return {
      summary,
      route: suggestedRoute,
    };

  } catch (error) {
    console.error("Error calling Gemini API for travel advice:", error);
    return {
      summary: "I'm having a little trouble connecting right now. Please try again in a moment.",
    };
  }
};

