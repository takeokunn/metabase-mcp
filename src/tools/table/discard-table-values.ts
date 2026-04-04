import type { MetabaseClient } from '@src/client';
import { type TableIdInput, TableIdInputSchema } from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for discarding cached field values for a table in Metabase
 */
export const discardTableValuesDefinition: ToolDefinition<TableIdInput> = {
  name: 'discard_table_values',
  description: 'Discard cached field values for a table in Metabase',
  inputSchema: TableIdInputSchema,
  handler: async (client: MetabaseClient, input: TableIdInput) => {
    const result = await client.post(`/api/table/${input.id}/discard_values`);
    return formatToolResponse(result);
  },
};
