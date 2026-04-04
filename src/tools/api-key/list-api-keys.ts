import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all API keys in Metabase
 */
export const listApiKeysDefinition: ToolDefinition = {
  name: 'list_api_keys',
  description: 'List all API keys in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/api-key');
    return formatToolResponse(result);
  },
};
