import type { MetabaseClient } from '@src/client';
import { type TableIdInput, TableIdInputSchema } from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting related tables and cards for a table in Metabase
 */
export const getTableRelatedDefinition: ToolDefinition<TableIdInput> = {
  name: 'get_table_related',
  description: 'Get related tables and cards for a table in Metabase',
  inputSchema: TableIdInputSchema,
  handler: async (client: MetabaseClient, input: TableIdInput) => {
    const result = await client.get(`/api/table/${input.id}/related`);
    return formatToolResponse(result);
  },
};
