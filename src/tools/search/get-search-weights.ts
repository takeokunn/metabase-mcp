import type { MetabaseClient } from '@src/client';
import { type GetSearchWeightsParams, GetSearchWeightsParamsSchema } from '@src/schemas/search';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getSearchWeightsDefinition: ToolDefinition<GetSearchWeightsParams> = {
  name: 'get_search_weights',
  description: 'Get search result ranking weights in Metabase',
  inputSchema: GetSearchWeightsParamsSchema,
  handler: async (client: MetabaseClient, _input: GetSearchWeightsParams) => {
    const result = await client.get('/api/search/weights');
    return formatToolResponse(result);
  },
};
