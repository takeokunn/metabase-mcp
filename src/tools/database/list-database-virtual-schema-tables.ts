import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all virtual tables across all databases
 */
export const listDatabaseVirtualSchemaTablesDefinition: ToolDefinition = {
  name: 'list_database_virtual_schema_tables',
  description: 'List all virtual tables (saved questions as tables) across all databases in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/database/virtual/table');
    return formatToolResponse(result);
  },
};
