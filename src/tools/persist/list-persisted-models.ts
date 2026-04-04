import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all persisted models in Metabase
 */
export const listPersistedModelsDefinition: ToolDefinition = {
  name: 'list_persisted_models',
  description: 'List all persisted models in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/persist');
    return formatToolResponse(result);
  },
};
