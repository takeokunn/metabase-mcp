import type { MetabaseClient } from '@src/client';
import { type ExportQueryInput, ExportQueryInputSchema } from '@src/schemas/dataset';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';
import { buildDatasetQueryBody } from './utils';

/**
 * Tool definition for exporting query results in various formats
 */
export const exportQueryDefinition: ToolDefinition<ExportQueryInput> = {
  name: 'export_query',
  description:
    'Export query results in CSV, JSON, or XLSX format. For MBQL queries, use type="query" and provide query object. For native SQL, use type="native" and provide native.query string.',
  inputSchema: ExportQueryInputSchema,
  handler: async (client: MetabaseClient, input: ExportQueryInput) => {
    const { format, ...queryInput } = input;
    const body = buildDatasetQueryBody(queryInput);
    const result = await client.post(`/api/dataset/${format}`, body);
    return formatToolResponse(result);
  },
};
