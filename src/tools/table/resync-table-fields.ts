import type { MetabaseClient } from '@src/client';
import { type TableIdInput, TableIdInputSchema } from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for rescanning field values for a table in Metabase
 */
export const resyncTableFieldsDefinition: ToolDefinition<TableIdInput> = {
  name: 'resync_table_fields',
  description: 'Rescan field values for a table in Metabase',
  inputSchema: TableIdInputSchema,
  handler: async (client: MetabaseClient, input: TableIdInput) => {
    const result = await client.post(`/api/table/${input.id}/rescan_values`);
    return formatToolResponse(result);
  },
};
