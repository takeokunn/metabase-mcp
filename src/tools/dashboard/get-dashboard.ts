import type { MetabaseClient } from '@src/client';
import { type GetDashboardParams, GetDashboardParamsSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single dashboard by ID
 */
export const getDashboardDefinition: ToolDefinition<GetDashboardParams> = {
  name: 'get_dashboard',
  description: 'Get a single dashboard by ID from Metabase',
  inputSchema: GetDashboardParamsSchema,
  handler: async (client: MetabaseClient, input: GetDashboardParams) => {
    const dashboard = await client.get(`/api/dashboard/${input.id}`);
    return formatToolResponse(dashboard);
  },
};
