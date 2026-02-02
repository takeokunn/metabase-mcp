import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting the collection tree hierarchy
 */
export const getCollectionTreeDefinition: ToolDefinition = {
  name: 'get_collection_tree',
  description: 'Get the hierarchical tree structure of all collections in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const tree = await client.get('/api/collection/tree');
    return formatToolResponse(tree);
  },
};
