import { supabaseClient } from './supabaseClient';

async function getUserId() {
  const session = await supabaseClient.auth.getSession();
  return session?.data?.session?.user?.id ?? null;
}

export async function getNextNowTask() {
  const userId = (await getUserId()) ?? '00000000-0000-0000-0000-000000000000';
  const { data, error } = await supabaseClient.rpc('tasks_get_next_now_task', {
    user_id: userId,
  });
  if (error) throw error;
  return data;
}

export async function startFocus(taskId: string) {
  const userId = (await getUserId()) ?? '00000000-0000-0000-0000-000000000000';
  const { data, error } = await supabaseClient.rpc('focus_start_session', {
    user_id: userId,
    task_id: taskId,
  });
  if (error) throw error;
  return data;
}

export async function endFocus(sessionId: string) {
  const { data, error } = await supabaseClient.rpc('focus_end_session', {
    session_id: sessionId,
  });
  if (error) throw error;
  return data;
}

export async function addParking(note: string) {
  const userId = (await getUserId()) ?? '00000000-0000-0000-0000-000000000000';
  const { data, error } = await supabaseClient.rpc('parking_add_item', {
    user_id: userId,
    note,
  });
  if (error) throw error;
  return data;
}
