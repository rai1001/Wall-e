const assert = require('assert');
const {
  generateNextSuggestion,
  confirmSuggestion,
  resetAssistantStore,
} = require('../supabase/edge-functions/assistant-service.cjs');

function testSuggestionCreatesRecord() {
  resetAssistantStore();
  const suggestion = generateNextSuggestion({
    planId: 'plan-1',
    organizationId: 'org-1',
    userId: 'user-1',
    prompt: 'Test prompt',
  });

  assert.strictEqual(suggestion.organization_id, 'org-1');
  assert.strictEqual(suggestion.status, 'proposed');
  assert.strictEqual(suggestion.prompt, 'Test prompt');
}

function testConfirmChangesStatus() {
  resetAssistantStore();
  const suggestion = generateNextSuggestion({
    planId: 'plan-2',
    organizationId: 'org-1',
    userId: 'user-1',
    prompt: 'Otra prueba',
  });

  const confirmed = confirmSuggestion({
    suggestionId: suggestion.id,
    organizationId: 'org-1',
    userId: 'user-1',
    approved: true,
  });

  assert.strictEqual(confirmed.status, 'accepted');
  assert.strictEqual(confirmed.approved, true);
}

function testCrossOrgBlock() {
  resetAssistantStore();
  const suggestion = generateNextSuggestion({
    planId: 'plan-3',
    organizationId: 'org-1',
    userId: 'user-1',
  });

  let error;
  try {
    confirmSuggestion({
      suggestionId: suggestion.id,
      organizationId: 'org-2',
      userId: 'user-1',
      approved: false,
    });
  } catch (err) {
    error = err;
  }

  assert.ok(error instanceof Error);
}

function runAssistantTests() {
  testSuggestionCreatesRecord();
  testConfirmChangesStatus();
  testCrossOrgBlock();
  console.log('✅ Assistant service behaves as expected.');
}

runAssistantTests();
