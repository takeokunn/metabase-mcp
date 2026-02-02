import type { MetabaseClient } from '@src/client';
import {
  type ListDatabaseTablesParams,
  ListDatabaseTablesParamsSchema,
} from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing tables in a database schema
 */
export const listDatabaseTablesDefinition: ToolDefinition<ListDatabaseTablesParams> = {
  name: 'list_database_tables',
  description: 'List tables in a database schema from Metabase',
  inputSchema: ListDatabaseTablesParamsSchema,
  handler: async (client: MetabaseClient, input: ListDatabaseTablesParams) => {
    const endpoint = input.schema
      ? `/api/database/${input.id}/schema/${encodeURIComponent(input.schema)}`
      : `/api/database/${input.id}/tables`;
    const tables = await client.get(endpoint);
    return formatToolResponse(tables);
  },
};
