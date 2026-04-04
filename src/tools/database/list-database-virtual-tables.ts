import type { MetabaseClient } from '@src/client';
import { type GetDatabaseParams, GetDatabaseParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing virtual tables (saved questions) in a database
 */
export const listDatabaseVirtualTablesDefinition: ToolDefinition<GetDatabaseParams> = {
  name: 'list_database_virtual_tables',
  description: 'List virtual tables (saved questions) available as tables in a database in Metabase',
  inputSchema: GetDatabaseParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseParams) => {
    const result = await client.get(`/api/database/${input.id}/schema`);
    return formatToolResponse(result);
  },
};
