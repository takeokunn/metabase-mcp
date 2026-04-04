import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getCacheConfigDefinition: ToolDefinition = {
  name: 'get_cache_config',
  description: 'Get the current query caching configuration in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/cache');
    return formatToolResponse(result);
  },
};
