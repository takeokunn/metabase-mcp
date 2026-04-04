import type { MetabaseClient } from '@src/client';
import { type RevertDashboardInput, RevertDashboardInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for reverting a dashboard to a previous revision in Metabase
 */
export const revertDashboardDefinition: ToolDefinition<RevertDashboardInput> = {
  name: 'revert_dashboard',
  description: 'Revert a dashboard to a previous revision in Metabase',
  inputSchema: RevertDashboardInputSchema,
  handler: async (client: MetabaseClient, input: RevertDashboardInput) => {
    const { dashboard_id, revision_id } = input;
    const result = await client.post('/api/revision/revert', {
      entity: 'dashboard',
      id: dashboard_id,
      revision_id,
    });
    return formatToolResponse(result);
  },
};
