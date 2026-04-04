import type { MetabaseClient } from '@src/client';
import { type RefreshPersistedModelParams, RefreshPersistedModelParamsSchema } from '@src/schemas/persist';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for refreshing a persisted model for a card
 */
export const refreshPersistedModelDefinition: ToolDefinition<RefreshPersistedModelParams> = {
  name: 'refresh_persisted_model',
  description: 'Refresh the persisted model cache for a card in Metabase',
  inputSchema: RefreshPersistedModelParamsSchema,
  handler: async (client: MetabaseClient, input: RefreshPersistedModelParams) => {
    const result = await client.post(`/api/persist/card/${input.card_id}/refresh`);
    return formatToolResponse(result);
  },
};
