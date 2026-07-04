import type { MetabaseClient } from '@src/client';
import {
  type GetMetricDimensionValuesParams,
  GetMetricDimensionValuesParamsSchema,
} from '@src/schemas/metric';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for fetching values for a dimension of a metric in Metabase
 */
export const getMetricDimensionValuesDefinition: ToolDefinition<GetMetricDimensionValuesParams> = {
  name: 'get_metric_dimension_values',
  description: 'Fetch values for a dimension of a metric in Metabase',
  inputSchema: GetMetricDimensionValuesParamsSchema,
  handler: async (client: MetabaseClient, input: GetMetricDimensionValuesParams) => {
    const result = await client.get(
      `/api/metric/${input.id}/dimension/${encodeURIComponent(input.dimension_key)}/values`,
    );
    return formatToolResponse(result);
  },
};
