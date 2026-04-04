import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all model indexes in Metabase
 */
export const listModelIndexesDefinition: ToolDefinition = {
  name: 'list_model_indexes',
  description: 'List all model indexes in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/model-index');
    return formatToolResponse(result);
  },
};
