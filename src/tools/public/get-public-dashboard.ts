import type { MetabaseClient } from '@src/client';
import { type GetPublicDashboardParams, GetPublicDashboardParamsSchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicDashboardDefinition: ToolDefinition<GetPublicDashboardParams> = {
  name: 'get_public_dashboard',
  description: 'Get a publicly shared dashboard by UUID from Metabase',
  inputSchema: GetPublicDashboardParamsSchema,
  handler: async (client: MetabaseClient, input: GetPublicDashboardParams) => {
    const result = await client.get(`/api/public/dashboard/${input.uuid}`);
    return formatToolResponse(result);
  },
};
