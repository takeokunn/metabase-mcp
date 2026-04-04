import type { MetabaseClient } from '@src/client';
import { type TableIdInput, TableIdInputSchema } from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getTableDataDefinition: ToolDefinition<TableIdInput> = {
  name: 'get_table_data',
  description: 'Get data rows from a table in Metabase',
  inputSchema: TableIdInputSchema,
  handler: async (client: MetabaseClient, input: TableIdInput) => {
    const result = await client.get(`/api/table/${input.id}/data`);
    return formatToolResponse(result);
  },
};
