import type { MetabaseClient } from '@src/client';
import { type GetMetricBreakoutValuesInput, GetMetricBreakoutValuesInputSchema } from '@src/schemas/metric';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting breakout dimension values for a metric
 */
export const getMetricBreakoutValuesDefinition: ToolDefinition<GetMetricBreakoutValuesInput> = {
  name: 'get_metric_breakout_values',
  description: 'Get breakout dimension values for a metric in Metabase',
  inputSchema: GetMetricBreakoutValuesInputSchema,
  handler: async (client: MetabaseClient, input: GetMetricBreakoutValuesInput) => {
    const result = await client.post('/api/metric/breakout-values', {
      metric_id: input.metric_id,
      dimension: input.dimension,
    });
    return formatToolResponse(result);
  },
};
