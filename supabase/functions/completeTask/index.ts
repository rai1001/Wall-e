import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (b: any, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

export default async function handler(req: Request) {
    if (req.method === "OPTIONS") return json({}, 200);
    const { task_id } = await req.json().catch(() => ({}));
    if (!task_id) return json({ error: "task_id_required" }, 400);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
        global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });

    const { data: u, error: ue } = await admin.auth.getUser();
    if (ue || !u?.user) return json({ error: "unauthorized" }, 401);
    const user_id = u.user.id;

    await admin.from("tasks").update({ status: "done" }).eq("id", task_id).eq("user_id", user_id);
    await admin.from("focus_sessions").update({ ended_at: new Date().toISOString(), outcome: "done" })
        .eq("user_id", user_id).eq("task_id", task_id).is("ended_at", null);

    return json({ ok: true });
}
Deno.serve(handler);
