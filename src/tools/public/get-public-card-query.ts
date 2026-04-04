import type { MetabaseClient } from '@src/client';
import { type GetPublicCardQueryParams, GetPublicCardQueryParamsSchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicCardQueryDefinition: ToolDefinition<GetPublicCardQueryParams> = {
  name: 'get_public_card_query',
  description: 'Get query results for a publicly shared card by UUID from Metabase',
  inputSchema: GetPublicCardQueryParamsSchema,
  handler: async (client: MetabaseClient, input: GetPublicCardQueryParams) => {
    const result = await client.get(`/api/public/card/${input.uuid}/query`);
    return formatToolResponse(result);
  },
};
