import type { MetabaseClient } from '@src/client';
import { type GetEmbedCardParams, GetEmbedCardParamsSchema } from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedCardDefinition: ToolDefinition<GetEmbedCardParams> = {
  name: 'get_embed_card',
  description: 'Get an embedded card by JWT token from Metabase',
  inputSchema: GetEmbedCardParamsSchema,
  handler: async (client: MetabaseClient, input: GetEmbedCardParams) => {
    const result = await client.get(`/api/embed/card/${input.token}`);
    return formatToolResponse(result);
  },
};
