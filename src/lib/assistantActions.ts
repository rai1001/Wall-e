const API_BASE = import.meta.env.VITE_ASSISTANT_API_URL ?? 'http://localhost:54321/functions/v1';

async function callAssistant(path, body) {
  if (!API_BASE) {
    return {
      id: 'demo-suggestion',
      suggestion: body.prompt ?? 'Recomendación preliminar',
      status: 'proposed',
      created_at: new Date().toISOString(),
    };
  }

  const response = await fetch(`${API_BASE}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function requestSuggestion(payload) {
  return callAssistant('assistant_suggest', payload);
}

export async function confirmSuggestion(payload) {
  return callAssistant('assistant_confirm', payload);
}
