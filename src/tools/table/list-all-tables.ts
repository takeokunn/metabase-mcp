import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';
import { z } from 'zod';

const ListAllTablesParamsSchema = z.object({});
type ListAllTablesParams = z.infer<typeof ListAllTablesParamsSchema>;

/**
 * Tool definition for listing all tables across all databases in Metabase
 */
export const listAllTablesDefinition: ToolDefinition<ListAllTablesParams> = {
  name: 'list_all_tables',
  description: 'List all tables across all databases in Metabase',
  inputSchema: ListAllTablesParamsSchema,
  handler: async (client: MetabaseClient, _input: ListAllTablesParams) => {
    const result = await client.get('/api/table');
    return formatToolResponse(result);
  },
};
