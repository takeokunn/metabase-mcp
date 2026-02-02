import type { MetabaseClient } from '@src/client';
import { type GetTableParams, GetTableParamsSchema } from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single table by ID
 */
export const getTableDefinition: ToolDefinition<GetTableParams> = {
  name: 'get_table',
  description: 'Get a single table by ID from Metabase',
  inputSchema: GetTableParamsSchema,
  handler: async (client: MetabaseClient, input: GetTableParams) => {
    const table = await client.get(`/api/table/${input.id}`);
    return formatToolResponse(table);
  },
};
