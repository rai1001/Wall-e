
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- Interfaces ---

export interface TaskInput {
    task_title: string;
    task_type: 'work' | 'home' | 'pet' | 'personal';
    task_description?: string;
    est_minutes?: number;
    energy?: 'low' | 'medium' | 'high';
}

export interface NextStepResponse {
    next_step: string;
    step_minutes: number;
}

export interface StuckInput {
    current_task: string;
    current_step: string;
    reason: 'overwhelmed' | 'bored' | 'confused' | 'tired' | 'distracted' | 'unknown';
}

export interface StuckResponse {
    next_step: string;
    step_minutes: number;
}

// --- Mocks ---

const MOCK_NEXT_STEPS: Record<string, NextStepResponse> = {
    'default': {
        next_step: "Despeja tu espacio de trabajo inmediato (3 items)",
        step_minutes: 5
    },
    'kitchen': {
        next_step: "Vacía el fregadero y deja la encimera despejada",
        step_minutes: 8
    },
    'email': {
        next_step: "Abre el correo y busca solo 'Factura'",
        step_minutes: 6
    }
};

const MOCK_STUCK_RESPONSES: Record<string, StuckResponse> = {
    'default': {
        next_step: "Solo siéntate 2 minutos y respira OR haz una cosa pequeña",
        step_minutes: 2
    }
};

// --- Service ---

class AiService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;

    constructor() {
        if (API_KEY && API_KEY !== 'YOUR_GEMINI_API_KEY') {
            this.genAI = new GoogleGenerativeAI(API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Efficient model for micro-tasks
        } else {
            console.warn("AiService: No valid API Key found. Using Mock Mode.");
        }
    }

    /**
     * PROMPT 1: Next Step Generator (Anti-Paralysis)
     */
    async generateNextStep(input: TaskInput): Promise<NextStepResponse> {
        if (!this.model) return this.mockNextStep(input);

        const prompt = `
Task:
Title: ${input.task_title}
Type: ${input.task_type}
Description: ${input.task_description || ''}
Estimated time: ${input.est_minutes || 30} minutes
Energy required: ${input.energy || 'medium'}

Generate ONE single next step that:
- can be started immediately
- is concrete and physical (clear action)
- takes between 5 and 12 minutes
- does NOT require planning or decisions

Do NOT explain.
Do NOT give multiple steps.
Do NOT include motivation.

Output JSON only: { "next_step": "string", "step_minutes": number }
`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return this.parseJson<NextStepResponse>(text) || this.mockNextStep(input);
        } catch (error) {
            console.error("AiService: generateNextStep failed", error);
            return this.mockNextStep(input);
        }
    }

    /**
     * PROMPT 2: Stuck Resolver (Anti-Block)
     */
    async resolveStuck(input: StuckInput): Promise<StuckResponse> {
        if (!this.model) return this.mockStuck(input);

        const prompt = `
The user is stuck during a task.

Task: ${input.current_task}
Current step: ${input.current_step}
Reason: ${input.reason}

Generate ONE alternative next step that:
- is easier than the current one
- reduces scope or difficulty
- can be done in under 8 minutes

If possible, give a binary choice (A or B).
Do NOT encourage.
Do NOT explain.

Output JSON only: { "next_step": "string", "step_minutes": number }
`;
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return this.parseJson<StuckResponse>(text) || this.mockStuck(input);
        } catch (error) {
            console.error("AiService: resolveStuck failed", error);
            return this.mockStuck(input);
        }
    }

    // --- Helpers ---

    private mockNextStep(input: TaskInput): NextStepResponse {
        console.log("AiService: Returning MOCK for next step");
        // Simple heuristic for better mocks
        const lowerTitle = input.task_title.toLowerCase();
        if (lowerTitle.includes('cocina') || lowerTitle.includes('kitchen')) return MOCK_NEXT_STEPS.kitchen;
        if (lowerTitle.includes('correo') || lowerTitle.includes('email')) return MOCK_NEXT_STEPS.email;

        return {
            next_step: `Start "${input.task_title}" by doing the first visible action`,
            step_minutes: 5
        };
    }

    private mockStuck(input: StuckInput): StuckResponse {
        console.log("AiService: Returning MOCK for stuck", input);
        return MOCK_STUCK_RESPONSES.default;
    }

    private parseJson<T>(text: string): T | null {
        try {
            // Remove code blocks if present
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText) as T;
        } catch (e) {
            console.error("AiService: JSON parse failed", e, text);
            return null;
        }
    }
}

export const aiService = new AiService();
