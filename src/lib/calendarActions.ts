import { supabaseClient } from './supabaseClient';

export type CalendarActionPayload = {
  calendar_id: string;
  title: string;
  start_time: string;
  end_time: string;
  metadata?: Record<string, unknown>;
  idempotency_key?: string;
};

export async function createEvent(payload: CalendarActionPayload) {
  const { data, error } = await supabaseClient.rpc('calendar.create_event', {
    calendar_id: payload.calendar_id,
    title: payload.title,
    start_time: payload.start_time,
    end_time: payload.end_time,
    metadata: payload.metadata ?? {},
    idempotency_key: payload.idempotency_key ?? crypto.randomUUID(),
  });

  if (error) throw error;
  return data;
}
