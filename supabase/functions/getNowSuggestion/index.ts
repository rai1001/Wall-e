// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(resBody: any, status = 200) {
    return new Response(JSON.stringify(resBody), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
}

function pickFallbackStep(taskTitle: string) {
    return { next_step: `Ordena 5 cosas visibles relacionadas con: ${taskTitle}`, step_minutes: 6 };
}

function coerceStep(ai: any, taskTitle: string) {
    const next_step = typeof ai?.next_step === "string" ? ai.next_step.trim() : "";
    const step_minutes = Number.isFinite(ai?.step_minutes) ? Number(ai.step_minutes) : NaN;

    if (!next_step) return pickFallbackStep(taskTitle);
    const mins = Math.max(5, Math.min(12, Number.isFinite(step_minutes) ? step_minutes : 8));
    // Guardrail: no listas largas
    if (next_step.split("\n").length > 2) return pickFallbackStep(taskTitle);
    return { next_step, step_minutes: mins };
}

async function callAntigravity(payload: any) {
    const apiKey = Deno.env.get("ANTIGRAVITY_API_KEY")!;
    const model = Deno.env.get("ANTIGRAVITY_MODEL") || "default";
    const system = Deno.env.get("ANTIGRAVITY_SYSTEM_PROMPT") || "";

    // Adaptar a tu proveedor si difiere
    const r = await fetch("https://api.antigravity.ai/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: "system", content: system },
                { role: "user", content: JSON.stringify(payload) },
            ],
            response_format: { type: "json_object" },
        }),
    });

    if (!r.ok) throw new Error(`antigravity_failed_${r.status}`);
    const data = await r.json();
    // Ajusta según respuesta real
    const content = data?.choices?.[0]?.message?.content ?? data?.content ?? "{}";
    return JSON.parse(content);
}

function taskToAIPayload(task: any) {
    return {
        context: "start_task",
        locale: "es-ES",
        coach_mode: "strict",
        user_profile: {
            needs: ["adhd", "heavy_coach", "low_decision_load"],
            tone: ["calm", "firm", "human", "no_guilt"],
        },
        task: {
            id: task.id,
            title: task.title,
            type: task.type,
            description: task.description ?? null,
            estimated_minutes: task.est_minutes ?? 30,
            energy: task.energy ?? "low",
            status: task.status,
        },
        constraints: {
            single_step_only: true,
            step_minutes_min: 5,
            step_minutes_max: 12,
            no_planning: true,
            no_new_tasks: true,
            no_judgment: true,
            output_format: "json",
        },
        instruction:
            "Generate ONE immediate next step to begin. It must be physical, concrete, and startable in under 30 seconds. Return JSON with: next_step (string), step_minutes (integer).",
    };
}

export default async function handler(req: Request) {
    if (req.method === "OPTIONS") return json({}, 200);

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const authHeader = req.headers.get("Authorization") || "";

        const admin = createClient(supabaseUrl, serviceRole, {
            global: { headers: { Authorization: authHeader } },
        });

        const { data: userData, error: userErr } = await admin.auth.getUser();
        if (userErr || !userData?.user) return json({ error: "unauthorized" }, 401);
        const user_id = userData.user.id;

        // 1) Si hay in_progress, esa manda
        const { data: inProg } = await admin
            .from("tasks")
            .select("*")
            .eq("user_id", user_id)
            .eq("status", "in_progress")
            .maybeSingle();

        let task = inProg;

        // 2) Si no hay, elige una "now task" simple (primera todo)
        if (!task) {
            const { data: next } = await admin
                .from("tasks")
                .select("*")
                .eq("user_id", user_id)
                .in("status", ["todo", "paused"])
                .order("created_at", { ascending: true })
                .limit(1)
                .maybeSingle();

            task = next;
        }

        if (!task) {
            return json({
                mode: "idle",
                message: "No hay tareas. Crea una y empezamos con un paso pequeño.",
            });
        }

        // 3) Ponerla in_progress (Focus Lock). Si ya lo está, ok.
        if (task.status !== "in_progress") {
            const { error: upErr } = await admin
                .from("tasks")
                .update({ status: "in_progress" })
                .eq("id", task.id)
                .eq("user_id", user_id);
            if (upErr) return json({ error: "cannot_start_task", detail: upErr.message }, 409);
            task.status = "in_progress";
        }

        // 4) IA: next step
        let step = pickFallbackStep(task.title);
        try {
            const aiPayload = taskToAIPayload(task);
            const ai = await callAntigravity(aiPayload);
            step = coerceStep(ai, task.title);
        } catch (_e) {
            // fallback silencioso
            step = pickFallbackStep(task.title);
        }

        // 5) Crear focus session si no existe abierta
        const { data: openSession } = await admin
            .from("focus_sessions")
            .select("*")
            .eq("user_id", user_id)
            .eq("task_id", task.id)
            .is("ended_at", null)
            .order("started_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (!openSession) {
            await admin.from("focus_sessions").insert({ user_id, task_id: task.id });
        }

        return json({
            mode: "focus_lock",
            now_task: { id: task.id, title: task.title, type: task.type },
            next_step: step.next_step,
            step_minutes: step.step_minutes,
            allowed_actions: ["done", "pause", "stuck", "parking"],
            checkin_minutes: 10,
        });
    } catch (e: any) {
        return json({ error: "server_error", detail: String(e?.message ?? e) }, 500);
    }
}

Deno.serve(handler);
