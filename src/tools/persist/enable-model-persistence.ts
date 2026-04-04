import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for enabling model persistence globally
 */
export const enableModelPersistenceDefinition: ToolDefinition = {
  name: 'enable_model_persistence',
  description: 'Enable model persistence globally in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.post('/api/persist/enable');
    return formatToolResponse(result);
  },
};
