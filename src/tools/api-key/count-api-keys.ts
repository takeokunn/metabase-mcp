import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for counting all API keys in Metabase
 */
export const countApiKeysDefinition: ToolDefinition = {
  name: 'count_api_keys',
  description: 'Get the count of all API keys in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/api-key/count');
    return formatToolResponse(result);
  },
};
