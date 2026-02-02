import type { MetabaseClient } from '@src/client';
import { type ListTableFieldsParams, ListTableFieldsParamsSchema } from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing fields of a table
 */
export const listTableFieldsDefinition: ToolDefinition<ListTableFieldsParams> = {
  name: 'list_table_fields',
  description: 'List all fields for a table from Metabase',
  inputSchema: ListTableFieldsParamsSchema,
  handler: async (client: MetabaseClient, input: ListTableFieldsParams) => {
    const fields = await client.get(`/api/table/${input.id}/fields`);
    return formatToolResponse(fields);
  },
};
