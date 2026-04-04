import type { MetabaseClient } from '@src/client';
import { type GetCardDashboardsInput, GetCardDashboardsInputSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getCardDashboardsDefinition: ToolDefinition<GetCardDashboardsInput> = {
  name: 'get_card_dashboards',
  description: 'Get dashboards that contain a specific card in Metabase',
  inputSchema: GetCardDashboardsInputSchema,
  handler: async (client: MetabaseClient, input: GetCardDashboardsInput) => {
    const result = await client.get(`/api/card/${input.id}/dashboards`);
    return formatToolResponse(result);
  },
};
