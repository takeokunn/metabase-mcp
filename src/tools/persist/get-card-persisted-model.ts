import type { MetabaseClient } from '@src/client';
import {
  type GetCardPersistedModelParams,
  GetCardPersistedModelParamsSchema,
} from '@src/schemas/persist';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a persisted model for a specific card
 */
export const getCardPersistedModelDefinition: ToolDefinition<GetCardPersistedModelParams> = {
  name: 'get_card_persisted_model',
  description: 'Get the persisted model info for a specific card in Metabase',
  inputSchema: GetCardPersistedModelParamsSchema,
  handler: async (client: MetabaseClient, input: GetCardPersistedModelParams) => {
    const result = await client.get(`/api/persist/card/${input.card_id}`);
    return formatToolResponse(result);
  },
};
