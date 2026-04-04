import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for generating a cryptographically secure random token
 */
export const generateRandomTokenDefinition: ToolDefinition = {
  name: 'generate_random_token',
  description: 'Generate a cryptographically secure random token in Metabase.',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/util/random_token');
    return formatToolResponse(result);
  },
};
