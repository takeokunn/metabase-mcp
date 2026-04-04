import type { MetabaseClient } from '@src/client';
import { type TableIdInput, TableIdInputSchema } from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getVirtualCardTableFksDefinition: ToolDefinition<TableIdInput> = {
  name: 'get_virtual_card_table_fks',
  description: 'Get foreign keys for a virtual card-based table in Metabase',
  inputSchema: TableIdInputSchema,
  handler: async (client: MetabaseClient, input: TableIdInput) => {
    const result = await client.get(`/api/table/card__${input.id}/fks`);
    return formatToolResponse(result);
  },
};
