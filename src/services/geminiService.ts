
import { GoogleGenerativeAI } from "@google/generative-ai";


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Fallback if no key is provided (for dev/demo purposes)
const isConfigured = !!API_KEY && API_KEY !== 'placeholder-key';

const genAI = new GoogleGenerativeAI(API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface VoiceParsingResult {
    title: string;
    start_time?: string;
    end_time?: string;
    location?: string;
    description?: string;
    category?: 'work' | 'home';
}

export const geminiService = {
    async parseEventFromText(text: string): Promise<VoiceParsingResult> {
        if (!isConfigured) {
            console.warn('Gemini API key missing. Returning raw text as title.');
            return { title: text };
        }

        const prompt = `
            Extract event details from this text: "${text}".
            Return ONLY a JSON object with these fields:
            - title (string, required)
            - start_time (ISO 8601 string, assume next occurrence if day of week mentioned, default to tomorrow 9am if unclear)
            - end_time (ISO 8601 string, default to start_time + 1 hour)
            - location (string, optional)
            - description (string, optional)
            - category ('work' or 'home', guess based on context)
            
            Current date: ${new Date().toISOString()}
            
            Example output: {"title": "Meeting", "start_time": "...", "category": "work"}
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up code blocks if Gemini returns them
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error('Gemini parsing failed:', error);
            return { title: text }; // Fallback
        }
    }
};
