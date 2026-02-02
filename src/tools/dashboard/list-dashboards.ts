import type { MetabaseClient } from '@src/client';
import { type ListDashboardsParams, ListDashboardsParamsSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all dashboards in Metabase
 */
export const listDashboardsDefinition: ToolDefinition<ListDashboardsParams> = {
  name: 'list_dashboards',
  description:
    'Get list of all dashboards in Metabase. Note: The Metabase API does not support filtering by collection on this endpoint. To get dashboards in a specific collection, use get_collection_items with models: ["dashboard"].',
  inputSchema: ListDashboardsParamsSchema,
  handler: async (client: MetabaseClient, _input: ListDashboardsParams) => {
    const dashboards = await client.get('/api/dashboard');
    return formatToolResponse(dashboards);
  },
};
