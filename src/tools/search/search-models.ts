import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting available search model types
 */
export const searchModelsDefinition: ToolDefinition = {
  name: 'search_models',
  description: 'Get the list of available model types that can be searched in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const models = await client.get('/api/search/models');
    return formatToolResponse(models);
  },
};
