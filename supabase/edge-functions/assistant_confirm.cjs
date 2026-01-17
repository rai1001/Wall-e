const { confirmSuggestion } = require('./assistant-service.cjs');

async function handler(event) {
  const auth = event.auth ?? {};
  const body = event.body ?? {};

  const result = confirmSuggestion({
    suggestionId: body.suggestion_id,
    organizationId: auth.organization_id,
    userId: auth.sub ?? auth.user_id,
    approved: body.approved,
  });

  return {
    status: 200,
    body: result,
  };
}

module.exports = {
  handler,
};
