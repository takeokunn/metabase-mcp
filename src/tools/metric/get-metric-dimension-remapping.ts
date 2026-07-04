import type { MetabaseClient } from '@src/client';
import {
  type GetMetricDimensionRemappingParams,
  GetMetricDimensionRemappingParamsSchema,
} from '@src/schemas/metric';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for fetching the remapping of a dimension value of a metric in Metabase
 */
export const getMetricDimensionRemappingDefinition: ToolDefinition<GetMetricDimensionRemappingParams> =
  {
    name: 'get_metric_dimension_remapping',
    description: 'Fetch the remapping for a dimension value of a metric in Metabase',
    inputSchema: GetMetricDimensionRemappingParamsSchema,
    handler: async (client: MetabaseClient, input: GetMetricDimensionRemappingParams) => {
      const result = await client.get(
        `/api/metric/${input.id}/dimension/${encodeURIComponent(input.dimension_key)}/remapping`,
        { value: input.value },
      );
      return formatToolResponse(result);
    },
  };
