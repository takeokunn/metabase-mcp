import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';
import { z } from 'zod';

const ListDatabaseVirtualSchemaTablesParamsSchema = z.object({
  virtual_db: z.number().describe('The virtual database ID to list datasets for'),
});

type ListDatabaseVirtualSchemaTablesParams = z.infer<
  typeof ListDatabaseVirtualSchemaTablesParamsSchema
>;

/**
 * Tool definition for listing virtual schema tables (datasets) for a virtual database
 */
export const listDatabaseVirtualSchemaTablesDefinition: ToolDefinition<ListDatabaseVirtualSchemaTablesParams> =
  {
    name: 'list_database_virtual_schema_tables',
    description:
      'List all virtual tables (saved questions as tables) across all databases in Metabase',
    inputSchema: ListDatabaseVirtualSchemaTablesParamsSchema,
    handler: async (client: MetabaseClient, input: ListDatabaseVirtualSchemaTablesParams) => {
      const result = await client.get(`/api/database/${input.virtual_db}/datasets`);
      return formatToolResponse(result);
    },
  };
