import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all databases configured in Metabase
 */
export const listDatabasesDefinition: ToolDefinition = {
  name: 'list_databases',
  description: 'Get list of databases configured in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const databases = await client.get('/api/database');
    return formatToolResponse(databases);
  },
};
