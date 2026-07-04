import type { MetabaseClient } from '@src/client';
import { type GetMetricDatasetInput, GetMetricDatasetInputSchema } from '@src/schemas/metric';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for running a metric definition as a dataset query in Metabase
 */
export const getMetricDatasetDefinition: ToolDefinition<GetMetricDatasetInput> = {
  name: 'get_metric_dataset',
  description: 'Run a metric definition as a dataset query in Metabase',
  inputSchema: GetMetricDatasetInputSchema,
  handler: async (client: MetabaseClient, input: GetMetricDatasetInput) => {
    const result = await client.post('/api/metric/dataset', {
      definition: input.definition,
    });
    return formatToolResponse(result);
  },
};
