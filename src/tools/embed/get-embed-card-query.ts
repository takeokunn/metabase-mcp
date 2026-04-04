import type { MetabaseClient } from '@src/client';
import { type GetEmbedCardQueryParams, GetEmbedCardQueryParamsSchema } from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedCardQueryDefinition: ToolDefinition<GetEmbedCardQueryParams> = {
  name: 'get_embed_card_query',
  description: 'Get query results for an embedded card by JWT token from Metabase',
  inputSchema: GetEmbedCardQueryParamsSchema,
  handler: async (client: MetabaseClient, input: GetEmbedCardQueryParams) => {
    const result = await client.get(`/api/embed/card/${input.token}/query`);
    return formatToolResponse(result);
  },
};
