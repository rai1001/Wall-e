import {
  generateNextSuggestion,
  confirmSuggestion,
  resetAssistantStore,
} from '../../supabase/edge-functions/assistant-service.cjs';

describe('assistant-service', () => {
  afterEach(() => {
    resetAssistantStore();
  });

  it('genera sugerencias con org y user obligatorios', () => {
    const suggestion = generateNextSuggestion({
      organizationId: 'org-1',
      userId: 'user-1',
      planId: 'plan-1',
      prompt: 'Prueba',
      metadata: { sprint: 5 },
    });

    expect(suggestion.organization_id).toBe('org-1');
    expect(suggestion.status).toBe('proposed');
    expect(suggestion.metadata?.sprint).toBe(5);
  });

  it('bloquea confirmaciones cross-org', () => {
    const suggestion = generateNextSuggestion({
      organizationId: 'org-1',
      userId: 'user-1',
    });

    expect(() =>
      confirmSuggestion({
        suggestionId: suggestion.id,
        organizationId: 'org-2',
        userId: 'user-2',
        approved: true,
      })
    ).toThrow();
  });

  it('actualiza el estado al confirmar', () => {
    const suggestion = generateNextSuggestion({
      organizationId: 'org-1',
      userId: 'user-1',
    });

    const updated = confirmSuggestion({
      suggestionId: suggestion.id,
      organizationId: 'org-1',
      userId: 'user-1',
      approved: true,
    });

    expect(updated.status).toBe('accepted');
    expect(updated.answered_at).toBeTruthy();
  });
});
