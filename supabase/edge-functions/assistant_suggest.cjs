const { generateNextSuggestion } = require('./assistant-service.cjs');

async function handler(event) {
  const auth = event.auth ?? {};
  const body = event.body ?? {};

  const suggestion = generateNextSuggestion({
    planId: body.plan_id,
    organizationId: auth.organization_id,
    userId: auth.sub ?? auth.user_id,
    prompt: body.prompt,
    metadata: body.metadata,
  });

  return {
    status: 200,
    body: suggestion,
  };
}

module.exports = {
  handler,
};
