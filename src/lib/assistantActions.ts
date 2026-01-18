import { supabaseClient } from './supabaseClient';

const API_BASE = import.meta.env.VITE_ASSISTANT_API_URL ?? 'http://localhost:54321/functions/v1';

export interface SuggestionRequest {
  plan_id: string;
  prompt: string;
  metadata?: Record<string, unknown>;
}

export interface SuggestionResponse {
  id: string;
  suggestion: string;
  status: 'proposed' | 'accepted' | 'declined';
  prompt?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface ConfirmPayload {
  suggestion_id: string;
  approved: boolean;
}

async function getAuthToken(): Promise<string | undefined> {
  const session = await supabaseClient.auth.getSession();
  return session.data.session?.access_token;
}

async function callAssistant<T>(path: string, body: Record<string, unknown>): Promise<T> {
  if (!API_BASE) {
    return {
      id: 'demo-suggestion',
      suggestion: body.prompt ?? 'Recomendación preliminar',
      status: 'proposed',
      created_at: new Date().toISOString(),
      prompt: body.prompt,
      metadata: body.metadata ?? {},
    } as T;
  }

  const token = await getAuthToken();

  const response = await fetch(`${API_BASE}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function requestSuggestion(payload: SuggestionRequest): Promise<SuggestionResponse> {
  return callAssistant<SuggestionResponse>('assistant_suggest', payload);
}

export async function confirmSuggestion(payload: ConfirmPayload): Promise<SuggestionResponse> {
  return callAssistant<SuggestionResponse>('assistant_confirm', payload);
}
