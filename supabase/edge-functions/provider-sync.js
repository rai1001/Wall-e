const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const ORG_HEADER = 'x-organization-id';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractOrgId = (headers = {}) => {
  const headerKey = Object.keys(headers).find((key) => key.toLowerCase() === ORG_HEADER);
  return headerKey ? headers[headerKey] : null;
};

const simulateProviderInteraction = async (job) => {
  const providerHint = job.payload?.metadata?.provider ?? job.payload?.provider ?? 'external';
  const details = {
    provider: providerHint,
    action: job.action,
    toggled: job.action === 'toggle' ? job.payload?.enabled : undefined,
  };

  console.log(`Simulating provider ${job.action} for org ${job.organization_id}`, details);

  await delay(120);

  return { success: true, details };
};

exports.handler = async (event) => {
  const orgId = extractOrgId(event?.headers);
  if (!orgId) {
    return { status: 400, body: 'Missing required header: x-organization-id' };
  }

  const { data: job, error } = await supabase
    .from('calendar_change_queue')
    .select('*')
    .eq('organization_id', orgId)
    .eq('status', 'pending')
    .order('enqueued_at', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error('Unable to fetch queued job', error);
    return { status: 500, body: error.message };
  }

  if (!job) {
    return { status: 200, body: { message: 'no pending job', organization_id: orgId } };
  }

  await supabase
    .from('calendar_change_queue')
    .update({ status: 'processing' })
    .match({ id: job.id });

  const interaction = await simulateProviderInteraction(job);

  await supabase
    .from('calendar_change_queue')
    .update({
      status: interaction.success ? 'synced' : 'pending',
      processed_at: new Date().toISOString(),
    })
    .match({ id: job.id });

  return {
    status: 200,
    body: {
      job_id: job.id,
      organization_id: orgId,
      interaction,
    },
  };
};
