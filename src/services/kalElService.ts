/**
 * Kal-el Service
 * Simple heuristic engine to provide ADHD unblocking strategies.
 */

const STRATEGIES = [
    "Just do 5 minutes. You can quit after that.",
    "What is the literal first physical step? Do just that.",
    "Lower the bar. A bad draft is better than no draft.",
    "Put on your 'Focus' playlist. Headphones on.",
    "Body Doubling: Pretend I'm watching you work.",
    "Is there a smaller sub-task hiding in this big task?",
];

const ENCOURAGEMENTS = [
    "You're doing great. Keep the momentum.",
    "One step at a time.",
    "Focus is a muscle. You're building it.",
    "Don't worry about perfect. Worry about done.",
];

export const kalElService = {
    /**
     * Get a random strategy for when the user is stuck
     */
    getStuckStrategy(): string {
        const idx = Math.floor(Math.random() * STRATEGIES.length);
        return STRATEGIES[idx];
    },

    /**
     * Get an encouragement for the active timer
     */
    getEncouragement(): string {
        const idx = Math.floor(Math.random() * ENCOURAGEMENTS.length);
        return ENCOURAGEMENTS[idx];
    },

    /**
     * Suggest a breakdown for a task (Mocked for now)
     */
    suggestNextStep(taskTitle: string): string {
        // Simple keyword matching for demo
        const lower = taskTitle.toLowerCase();

        if (lower.includes("email") || lower.includes("message")) {
            return "Open your email client and hit 'Compose'. don't think about the content yet.";
        }
        if (lower.includes("write") || lower.includes("draft") || lower.includes("report")) {
            return "Open a blank document and write the title. That counts.";
        }
        if (lower.includes("call") || lower.includes("phone")) {
            return "Find the number and put it in the dialer.";
        }

        return "Identify the very first, tiny action you can take right now.";
    }
};
