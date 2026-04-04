import type { MetabaseClient } from '@src/client';
import { type GetDashboardItemsInput, GetDashboardItemsInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getDashboardItemsDefinition: ToolDefinition<GetDashboardItemsInput> = {
  name: 'get_dashboard_items',
  description: 'Get items (dashcards) of a dashboard in Metabase',
  inputSchema: GetDashboardItemsInputSchema,
  handler: async (client: MetabaseClient, input: GetDashboardItemsInput) => {
    const result = await client.get(`/api/dashboard/${input.id}/items`);
    return formatToolResponse(result);
  },
};
