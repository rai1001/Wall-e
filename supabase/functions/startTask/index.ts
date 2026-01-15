import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

export default async function handler(req: Request) {
    if (req.method === "OPTIONS") return json({}, 200);

    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const task_id = typeof body['task_id'] === "string" ? body['task_id'] : null;
    if (!task_id) return json({ error: "task_id_required" }, 400);

    const url = Deno.env.get("SUPABASE_URL")!;
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") || "";

    const admin = createClient(url, key, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await admin.auth.getUser();
    if (userErr || !userData?.user) return json({ error: "unauthorized" }, 401);
    const user_id = userData.user.id;

    const { error } = await admin.from("tasks").update({ status: "in_progress" }).eq("id", task_id).eq("user_id", user_id);
    if (error) return json({ error: "cannot_start", detail: error.message }, 409);

    await admin.from("focus_sessions").insert({ user_id, task_id });

    return json({ ok: true });
}
Deno.serve(handler);
