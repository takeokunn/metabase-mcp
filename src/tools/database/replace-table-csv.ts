import type { MetabaseClient } from '@src/client';
import { z } from 'zod';
import { DatabaseIdSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const ReplaceTableCsvParamsSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID'),
  table_id: z.number().describe('ID of the table to replace with CSV data'),
});

export type ReplaceTableCsvParams = z.infer<typeof ReplaceTableCsvParamsSchema>;

/**
 * Tool definition for replacing an existing table with CSV data
 */
export const replaceTableCsvDefinition: ToolDefinition<ReplaceTableCsvParams> = {
  name: 'replace_table_csv',
  description: 'Replace an existing table with CSV data in a database in Metabase',
  inputSchema: ReplaceTableCsvParamsSchema,
  handler: async (client: MetabaseClient, input: ReplaceTableCsvParams) => {
    const result = await client.post(`/api/database/${input.id}/table/${input.table_id}/replace`);
    return formatToolResponse(result);
  },
};
