import type { MetabaseClient } from '@src/client';
import { type ExtractTablesFromSqlInput, ExtractTablesFromSqlInputSchema } from '@src/schemas/llm';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const extractTablesFromSqlDefinition: ToolDefinition<ExtractTablesFromSqlInput> = {
  name: 'extract_tables_from_sql',
  description: '[Requires Metabase Pro] Extract table references from a SQL query using AI',
  inputSchema: ExtractTablesFromSqlInputSchema,
  handler: async (client: MetabaseClient, input: ExtractTablesFromSqlInput) => {
    const result = await client.post('/api/llm/extract-sources', {
      database_id: input.database_id,
      sql: input.sql,
      ...(input.template_tags !== undefined ? { template_tags: input.template_tags } : {}),
    });
    return formatToolResponse(result);
  },
};
