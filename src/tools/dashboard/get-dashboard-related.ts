import type { MetabaseClient } from '@src/client';
import { type GetDashboardRelatedInput, GetDashboardRelatedInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getDashboardRelatedDefinition: ToolDefinition<GetDashboardRelatedInput> = {
  name: 'get_dashboard_related',
  description: 'Get related items for a dashboard in Metabase',
  inputSchema: GetDashboardRelatedInputSchema,
  handler: async (client: MetabaseClient, input: GetDashboardRelatedInput) => {
    const result = await client.get(`/api/dashboard/${input.id}/related`);
    return formatToolResponse(result);
  },
};
