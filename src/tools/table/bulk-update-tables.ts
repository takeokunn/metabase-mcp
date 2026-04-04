import type { MetabaseClient } from '@src/client';
import { type BulkUpdateTablesInput, BulkUpdateTablesInputSchema } from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for bulk updating multiple tables in Metabase
 */
export const bulkUpdateTablesDefinition: ToolDefinition<BulkUpdateTablesInput> = {
  name: 'bulk_update_tables',
  description: 'Bulk update multiple tables in Metabase',
  inputSchema: BulkUpdateTablesInputSchema,
  handler: async (client: MetabaseClient, input: BulkUpdateTablesInput) => {
    const result = await client.put('/api/table', input.tables);
    return formatToolResponse(result);
  },
};
