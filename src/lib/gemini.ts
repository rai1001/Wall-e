import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error('Missing Gemini API Key. Please check .env file.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
export const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
