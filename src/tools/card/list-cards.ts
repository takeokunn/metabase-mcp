import type { MetabaseClient } from '@src/client';
import { type ListCardsParams, ListCardsParamsSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all cards (saved questions) in Metabase
 */
export const listCardsDefinition: ToolDefinition<ListCardsParams> = {
  name: 'list_cards',
  description: 'Get list of cards (saved questions) in Metabase, optionally filtered by collection',
  inputSchema: ListCardsParamsSchema,
  handler: async (client: MetabaseClient, input: ListCardsParams) => {
    const params = input.collection_id ? { collection: input.collection_id } : undefined;
    const cards = await client.get('/api/card', params);
    return formatToolResponse(cards);
  },
};
