import type { MetabaseClient } from '@src/client';
import { type InvalidateCacheInput, InvalidateCacheInputSchema } from '@src/schemas/cache';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const invalidateCacheDefinition: ToolDefinition<InvalidateCacheInput> = {
  name: 'invalidate_cache',
  description: 'Invalidate cached query results in Metabase',
  inputSchema: InvalidateCacheInputSchema,
  handler: async (client: MetabaseClient, input: InvalidateCacheInput) => {
    const result = await client.post('/api/cache/invalidate', {
      model: input.model,
      model_id: input.model_id,
    });
    return formatToolResponse(result);
  },
};
