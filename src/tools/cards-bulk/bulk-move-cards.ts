import type { MetabaseClient } from '@src/client';
import { type BulkMoveCardsInput, BulkMoveCardsInputSchema } from '@src/schemas/cards-bulk';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for bulk moving multiple cards to a collection
 */
export const bulkMoveCardsDefinition: ToolDefinition<BulkMoveCardsInput> = {
  name: 'bulk_move_cards',
  description:
    'Move multiple cards to a target collection in bulk. Useful for reorganizing cards without updating them one by one.',
  inputSchema: BulkMoveCardsInputSchema,
  handler: async (client: MetabaseClient, input: BulkMoveCardsInput) => {
    const result = await client.post('/api/cards/move', {
      card_ids: input.card_ids,
      collection_id: input.collection_id,
    });
    return formatToolResponse(result);
  },
};
