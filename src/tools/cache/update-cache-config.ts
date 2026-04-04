import type { MetabaseClient } from '@src/client';
import { type UpdateCacheConfigInput, UpdateCacheConfigInputSchema } from '@src/schemas/cache';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateCacheConfigDefinition: ToolDefinition<UpdateCacheConfigInput> = {
  name: 'update_cache_config',
  description: 'Set the query caching configuration in Metabase',
  inputSchema: UpdateCacheConfigInputSchema,
  handler: async (client: MetabaseClient, input: UpdateCacheConfigInput) => {
    const result = await client.put('/api/cache', {
      model: input.model,
      model_id: input.model_id,
      strategy: input.strategy,
      config: input.config,
    });
    return formatToolResponse(result);
  },
};
