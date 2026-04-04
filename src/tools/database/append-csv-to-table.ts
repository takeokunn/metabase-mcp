import type { MetabaseClient } from '@src/client';
import { z } from 'zod';
import { DatabaseIdSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const AppendCsvToTableParamsSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID'),
  table_id: z.number().describe('ID of the table to append rows to'),
});

export type AppendCsvToTableParams = z.infer<typeof AppendCsvToTableParamsSchema>;

/**
 * Tool definition for appending CSV data to an existing table
 */
export const appendCsvToTableDefinition: ToolDefinition<AppendCsvToTableParams> = {
  name: 'append_csv_to_table',
  description: 'Append rows from a CSV upload to an existing table in a database in Metabase',
  inputSchema: AppendCsvToTableParamsSchema,
  handler: async (client: MetabaseClient, input: AppendCsvToTableParams) => {
    const result = await client.post(`/api/database/${input.id}/table/${input.table_id}/append`);
    return formatToolResponse(result);
  },
};
