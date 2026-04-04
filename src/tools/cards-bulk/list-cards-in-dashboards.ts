import type { MetabaseClient } from '@src/client';
import {
  type ListCardsInDashboardsInput,
  ListCardsInDashboardsInputSchema,
} from '@src/schemas/cards-bulk';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listCardsInDashboardsDefinition: ToolDefinition<ListCardsInDashboardsInput> = {
  name: 'list_cards_in_dashboards',
  description: 'Get dashboards that contain the specified cards in Metabase',
  inputSchema: ListCardsInDashboardsInputSchema,
  handler: async (client: MetabaseClient, input: ListCardsInDashboardsInput) => {
    const result = await client.post('/api/cards/dashboards', { card_ids: input.card_ids });
    return formatToolResponse(result);
  },
};
