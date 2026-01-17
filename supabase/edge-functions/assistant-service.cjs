const crypto = require('crypto');

const suggestionStore = new Map();

function ensureOrganizationId(organizationId = '') {
  if (!organizationId) {
    throw new Error('organization_id es obligatorio');
  }
  return organizationId;
}

function ensureUserId(userId = '') {
  if (!userId) {
    throw new Error('user_id es obligatorio');
  }
  return userId;
}

function generateNextSuggestion({ planId, organizationId, userId, prompt = '', metadata = {} }) {
  ensureOrganizationId(organizationId);
  ensureUserId(userId);

  const suggestionId = crypto.randomUUID();
  const suggestion = {
    id: suggestionId,
    plan_id: planId ?? 'plan-default',
    organization_id: organizationId,
    user_id: userId,
    suggestion: prompt || 'Revisa dependencias y preserva la cola.',
    status: 'proposed',
    prompt,
    metadata,
    created_at: new Date().toISOString(),
  };

  suggestionStore.set(suggestionId, suggestion);
  return suggestion;
}

function confirmSuggestion({ suggestionId, organizationId, userId, approved }) {
  ensureOrganizationId(organizationId);
  ensureUserId(userId);

  const existing = suggestionStore.get(suggestionId);
  if (!existing) {
    throw new Error('Sugerencia no encontrada');
  }

  if (existing.organization_id !== organizationId) {
    throw new Error('No puedes confirmar una sugerencia de otra organización');
  }

  const updated = {
    ...existing,
    status: approved ? 'accepted' : 'declined',
    answered_at: new Date().toISOString(),
    approved: Boolean(approved),
  };

  suggestionStore.set(suggestionId, updated);
  return updated;
}

function resetAssistantStore() {
  suggestionStore.clear();
}

module.exports = {
  generateNextSuggestion,
  confirmSuggestion,
  resetAssistantStore,
};
