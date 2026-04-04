import type { MetabaseClient } from '@src/client';
import { type PersistCardParams, PersistCardParamsSchema } from '@src/schemas/persist';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for enabling model persistence for a card
 */
export const persistCardDefinition: ToolDefinition<PersistCardParams> = {
  name: 'persist_card',
  description: 'Enable model persistence for a card/model in Metabase',
  inputSchema: PersistCardParamsSchema,
  handler: async (client: MetabaseClient, input: PersistCardParams) => {
    const result = await client.post(`/api/persist/card/${input.card_id}/persist`);
    return formatToolResponse(result);
  },
};
