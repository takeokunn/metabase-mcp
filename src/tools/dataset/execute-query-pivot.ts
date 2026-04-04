import type { MetabaseClient } from '@src/client';
import { type ExecutePivotQueryInput, ExecutePivotQueryInputSchema } from '@src/schemas/dataset';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for executing a pivot query
 */
export const executeQueryPivotDefinition: ToolDefinition<ExecutePivotQueryInput> = {
  name: 'execute_query_pivot',
  description:
    'Execute a pivot query against a Metabase database. Use this for pivot table visualizations that aggregate data across multiple dimensions.',
  inputSchema: ExecutePivotQueryInputSchema,
  handler: async (client: MetabaseClient, input: ExecutePivotQueryInput) => {
    const result = await client.post('/api/dataset/pivot', {
      query: input.query,
    });
    return formatToolResponse(result);
  },
};
