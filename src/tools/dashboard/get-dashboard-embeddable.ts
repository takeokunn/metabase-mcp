import type { MetabaseClient } from '@src/client';
import { ListPublicDashboardsParamsSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all dashboards available for embedding in Metabase (admin only)
 */
export const getDashboardEmbeddableDefinition: ToolDefinition<Record<string, never>> = {
  name: 'get_dashboard_embeddable',
  description: 'List all dashboards available for embedding in Metabase (admin only)',
  inputSchema: ListPublicDashboardsParamsSchema,
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/dashboard/embeddable');
    return formatToolResponse(result);
  },
};
