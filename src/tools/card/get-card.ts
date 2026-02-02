import type { MetabaseClient } from '@src/client';
import { type GetCardParams, GetCardParamsSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single card (saved question) by ID
 */
export const getCardDefinition: ToolDefinition<GetCardParams> = {
  name: 'get_card',
  description: 'Get a single card (saved question) by ID from Metabase',
  inputSchema: GetCardParamsSchema,
  handler: async (client: MetabaseClient, input: GetCardParams) => {
    const card = await client.get(`/api/card/${input.id}`);
    return formatToolResponse(card);
  },
};
