import type { MetabaseClient } from '@src/client';
import {
  type GetMetricBreakoutValuesInput,
  GetMetricBreakoutValuesInputSchema,
} from '@src/schemas/metric';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for computing breakout values for a metric definition in Metabase
 */
export const getMetricBreakoutValuesDefinition: ToolDefinition<GetMetricBreakoutValuesInput> = {
  name: 'get_metric_breakout_values',
  description: 'Compute breakout values for a metric definition in Metabase',
  inputSchema: GetMetricBreakoutValuesInputSchema,
  handler: async (client: MetabaseClient, input: GetMetricBreakoutValuesInput) => {
    const result = await client.post('/api/metric/breakout-values', {
      definition: input.definition,
    });
    return formatToolResponse(result);
  },
};
