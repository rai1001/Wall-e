export type NowResponse =
    | { mode: "idle"; message: string }
    | {
        mode: "focus_lock";
        now_task: { id: string; title: string; type: string };
        next_step: string;
        step_minutes: number;
        allowed_actions: string[];
        checkin_minutes: number;
    };

export type TaskType = 'work' | 'home' | 'pet' | 'personal';
