import type { MetabaseClient } from '@src/client';
import { type ExecuteQueryInput, ExecuteQueryInputSchema } from '@src/schemas/dataset';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';
import { buildDatasetQueryBody } from './utils';

/**
 * Tool definition for executing a query against a database
 */
export const executeQueryDefinition: ToolDefinition<ExecuteQueryInput> = {
  name: 'execute_query',
  description:
    'Execute an MBQL or native SQL query against a database. For MBQL queries, use type="query" and provide query object. For native SQL, use type="native" and provide native.query string.',
  inputSchema: ExecuteQueryInputSchema,
  handler: async (client: MetabaseClient, input: ExecuteQueryInput) => {
    const body = buildDatasetQueryBody(input);
    const result = await client.post('/api/dataset', body);
    return formatToolResponse(result);
  },
};
