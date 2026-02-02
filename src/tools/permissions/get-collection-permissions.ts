import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting the collection permissions graph from Metabase
 */
export const getCollectionPermissionsDefinition: ToolDefinition = {
  name: 'get_collection_permissions',
  description: 'Get the collection permissions graph for all groups and collections in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/collection/graph');
    return formatToolResponse(result);
  },
};
