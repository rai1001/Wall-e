import { model } from '../lib/gemini';
import type { NowResponse } from '../lib/types';
import { TASK_DATA } from '../data/mockData';

export const aiCoach = {
    async getNowSuggestion(): Promise<NowResponse> {
        try {
            // Context for AI
            const context = {
                time: new Date().toLocaleTimeString(),
                tasks: TASK_DATA.filter(t => t.status === 'pending'),
                energy: 'medium', // mock default
            };

            const prompt = `
            You are an elite ADHD Focus Coach.
            Current Context: ${JSON.stringify(context)}
            
            Decide the SINGLE most important thing for the user to do right now.
            If there are no urgent tasks, return mode "idle".
            If there is a task, return mode "focus_lock" and break it down into the immediate next step.

            Return strictly JSON matching this TS type:
            type Response = 
                | { mode: "idle"; message: string }
                | { 
                    mode: "focus_lock"; 
                    now_task: { id: string; title: string; type: string };
                    next_step: string;
                    step_minutes: number;
                    checkin_minutes: number;
                    allowed_actions: string[];
                  }
            `;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Clean markdown code blocks if present
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(cleanText) as NowResponse;
        } catch (error) {
            console.error("AI Coach Error:", error);
            // Fallback
            return {
                mode: "idle",
                message: "Coach is offline. Try refreshing."
            };
        }
    }
};
