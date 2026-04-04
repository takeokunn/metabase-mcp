import type { MetabaseClient } from '@src/client';
import { type ExecuteMetricInput, ExecuteMetricInputSchema } from '@src/schemas/metric';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for executing a metric query
 */
export const executeMetricDefinition: ToolDefinition<ExecuteMetricInput> = {
  name: 'execute_metric',
  description: 'Execute a metric query in Metabase',
  inputSchema: ExecuteMetricInputSchema,
  handler: async (client: MetabaseClient, input: ExecuteMetricInput) => {
    const result = await client.post('/api/metric/dataset', { query: input.query });
    return formatToolResponse(result);
  },
};
