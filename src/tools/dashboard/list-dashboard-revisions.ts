import type { MetabaseClient } from '@src/client';
import {
  type ListDashboardRevisionsParams,
  ListDashboardRevisionsParamsSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing dashboard revision history in Metabase
 */
export const listDashboardRevisionsDefinition: ToolDefinition<ListDashboardRevisionsParams> = {
  name: 'list_dashboard_revisions',
  description: 'List revision history for a dashboard in Metabase',
  inputSchema: ListDashboardRevisionsParamsSchema,
  handler: async (client: MetabaseClient, input: ListDashboardRevisionsParams) => {
    const { dashboard_id } = input;
    const result = await client.get(`/api/dashboard/${dashboard_id}/revisions`);
    return formatToolResponse(result);
  },
};
