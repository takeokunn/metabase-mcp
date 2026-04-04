import type { MetabaseClient } from '@src/client';
import { type UnpersistCardParams, UnpersistCardParamsSchema } from '@src/schemas/persist';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for disabling model persistence for a card
 */
export const unpersistCardDefinition: ToolDefinition<UnpersistCardParams> = {
  name: 'unpersist_card',
  description: 'Disable model persistence for a card/model in Metabase',
  inputSchema: UnpersistCardParamsSchema,
  handler: async (client: MetabaseClient, input: UnpersistCardParams) => {
    const result = await client.post(`/api/persist/card/${input.card_id}/unpersist`);
    return formatToolResponse(result);
  },
};
