const { supabaseClient } = require('@supabase/supabase-js');

/**
 * Basic queue processor that reads pending jobs for the current organization,
 * marks them processing => synced and returns the processed rows.
 * In production this should call provider APIs (Google/Microsoft) before marking synced.
 */
exports.handler = async (event, context) => {
  const orgId = context.user?.app_metadata?.organization_id || context.user?.organization_id;
  if (!orgId) {
    return { status: 401, body: 'organization_id missing' };
  }

  const queue = await supabaseClient
    .from('calendar_change_queue')
    .select('*')
    .eq('organization_id', orgId)
    .eq('status', 'pending')
    .order('enqueued_at', { ascending: true })
    .limit(1)
    .single();

  if (!queue.data) {
    return { status: 200, body: { message: 'no pending job' } };
  }

  // mark processing
  await supabaseClient
    .from('calendar_change_queue')
    .update({ status: 'processing' })
    .eq('id', queue.data.id);

  // placeholder for actual push/pull logic
  await new Promise((r) => setTimeout(r, 100));

  await supabaseClient
    .from('calendar_change_queue')
    .update({ status: 'synced' })
    .eq('id', queue.data.id);

  return {
    status: 200,
    body: { job: queue.data },
  };
};
