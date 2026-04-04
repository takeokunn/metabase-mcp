import type { MetabaseClient } from '@src/client';
import { type UpdateSearchWeightsInput, UpdateSearchWeightsInputSchema } from '@src/schemas/search';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateSearchWeightsDefinition: ToolDefinition<UpdateSearchWeightsInput> = {
  name: 'update_search_weights',
  description: 'Update search result ranking weights in Metabase',
  inputSchema: UpdateSearchWeightsInputSchema,
  handler: async (client: MetabaseClient, input: UpdateSearchWeightsInput) => {
    const result = await client.put('/api/search/weights', input.weights);
    return formatToolResponse(result);
  },
};
