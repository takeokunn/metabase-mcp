import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting the data permissions graph from Metabase
 */
export const getDataPermissionsDefinition: ToolDefinition = {
  name: 'get_data_permissions',
  description: 'Get the data permissions graph for all groups and databases in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/permissions/graph');
    return formatToolResponse(result);
  },
};
