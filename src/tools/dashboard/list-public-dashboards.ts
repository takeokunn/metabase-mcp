import type { MetabaseClient } from '@src/client';
import { type ListPublicDashboardsParams, ListPublicDashboardsParamsSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all dashboards with public links in Metabase (superuser only)
 */
export const listPublicDashboardsDefinition: ToolDefinition<ListPublicDashboardsParams> = {
  name: 'list_public_dashboards',
  description: 'List all dashboards with public sharing links in Metabase (superuser only)',
  inputSchema: ListPublicDashboardsParamsSchema,
  handler: async (client: MetabaseClient, _input: ListPublicDashboardsParams) => {
    const result = await client.get('/api/dashboard/public');
    return formatToolResponse(result);
  },
};
