import type { MetabaseClient } from '@src/client';
import { type GetCardSeriesParams, GetCardSeriesParamsSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting related series for a card in Metabase
 */
export const getCardSeriesDefinition: ToolDefinition<GetCardSeriesParams> = {
  name: 'get_card_series',
  description: 'Get related series data for a card (saved question) in Metabase',
  inputSchema: GetCardSeriesParamsSchema,
  handler: async (client: MetabaseClient, input: GetCardSeriesParams) => {
    const result = await client.get(`/api/card/${input.id}/series`);
    return formatToolResponse(result);
  },
};
