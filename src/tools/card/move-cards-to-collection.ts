import type { MetabaseClient } from '@src/client';
import { type MoveCardsToCollectionInput, MoveCardsToCollectionInputSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const moveCardsToCollectionDefinition: ToolDefinition<MoveCardsToCollectionInput> = {
  name: 'move_cards_to_collection',
  description: 'Move multiple cards to a collection in Metabase',
  inputSchema: MoveCardsToCollectionInputSchema,
  handler: async (client: MetabaseClient, input: MoveCardsToCollectionInput) => {
    const result = await client.post('/api/card/collections', { card_ids: input.card_ids, collection_id: input.collection_id });
    return formatToolResponse(result);
  },
};
