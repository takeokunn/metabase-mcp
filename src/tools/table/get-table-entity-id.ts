import type { MetabaseClient } from '@src/client';
import { type TableIdInput, TableIdInputSchema } from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting the entity ID of a table in Metabase
 */
export const getTableEntityIdDefinition: ToolDefinition<TableIdInput> = {
  name: 'get_table_entity_id',
  description: 'Get the entity ID of a table in Metabase',
  inputSchema: TableIdInputSchema,
  handler: async (client: MetabaseClient, input: TableIdInput) => {
    const result = await client.get(`/api/table/${input.id}/entity_id`);
    return formatToolResponse(result);
  },
};
