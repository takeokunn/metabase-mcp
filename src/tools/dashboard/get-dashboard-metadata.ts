import type { MetabaseClient } from '@src/client';
import { type GetDashboardParams, GetDashboardParamsSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting dashboard query metadata
 */
export const getDashboardMetadataDefinition: ToolDefinition<GetDashboardParams> = {
  name: 'get_dashboard_metadata',
  description: 'Get dashboard query metadata from Metabase',
  inputSchema: GetDashboardParamsSchema,
  handler: async (client: MetabaseClient, input: GetDashboardParams) => {
    const metadata = await client.get(`/api/dashboard/${input.id}/query_metadata`);
    return formatToolResponse(metadata);
  },
};
