import type { MetabaseClient } from '@src/client';
import { type BulkMoveCardsInput, BulkMoveCardsInputSchema } from '@src/schemas/cards-bulk';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const bulkMoveCardsDefinition: ToolDefinition<BulkMoveCardsInput> = {
  name: 'bulk_move_cards',
  description: 'Move multiple cards to a collection in Metabase',
  inputSchema: BulkMoveCardsInputSchema,
  handler: async (client: MetabaseClient, input: BulkMoveCardsInput) => {
    const result = await client.post('/api/cards/move', {
      card_ids: input.card_ids,
      collection_id: input.collection_id,
    });
    return formatToolResponse(result);
  },
};
