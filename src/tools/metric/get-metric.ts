import type { MetabaseClient } from '@src/client';
import { type GetMetricParams, GetMetricParamsSchema } from '@src/schemas/metric';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a specific metric by ID in Metabase
 */
export const getMetricDefinition: ToolDefinition<GetMetricParams> = {
  name: 'get_metric',
  description: 'Get a specific metric by ID in Metabase',
  inputSchema: GetMetricParamsSchema,
  handler: async (client: MetabaseClient, input: GetMetricParams) => {
    const result = await client.get(`/api/metric/${input.id}`);
    return formatToolResponse(result);
  },
};
