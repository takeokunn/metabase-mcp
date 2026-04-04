import type { MetabaseClient } from '@src/client';
import { type TableIdInput, TableIdInputSchema } from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for syncing the schema for a table in Metabase
 */
export const syncTableSchemaDefinition: ToolDefinition<TableIdInput> = {
  name: 'sync_table_schema',
  description: 'Sync the schema for a table in Metabase',
  inputSchema: TableIdInputSchema,
  handler: async (client: MetabaseClient, input: TableIdInput) => {
    const result = await client.post(`/api/table/${input.id}/sync_schema`);
    return formatToolResponse(result);
  },
};
