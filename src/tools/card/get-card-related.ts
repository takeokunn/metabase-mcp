import type { MetabaseClient } from '@src/client';
import { type GetCardRelatedParams, GetCardRelatedParamsSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting related cards and tables for a card in Metabase
 */
export const getCardRelatedDefinition: ToolDefinition<GetCardRelatedParams> = {
  name: 'get_card_related',
  description: 'Get related cards and tables for a card (saved question) in Metabase',
  inputSchema: GetCardRelatedParamsSchema,
  handler: async (client: MetabaseClient, input: GetCardRelatedParams) => {
    const result = await client.get(`/api/card/${input.id}/related`);
    return formatToolResponse(result);
  },
};
