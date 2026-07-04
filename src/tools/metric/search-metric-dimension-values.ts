import type { MetabaseClient } from '@src/client';
import {
  type SearchMetricDimensionValuesParams,
  SearchMetricDimensionValuesParamsSchema,
} from '@src/schemas/metric';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for searching values for a dimension of a metric in Metabase
 */
export const searchMetricDimensionValuesDefinition: ToolDefinition<SearchMetricDimensionValuesParams> =
  {
    name: 'search_metric_dimension_values',
    description: 'Search values for a dimension of a metric in Metabase',
    inputSchema: SearchMetricDimensionValuesParamsSchema,
    handler: async (client: MetabaseClient, input: SearchMetricDimensionValuesParams) => {
      const result = await client.get(
        `/api/metric/${input.id}/dimension/${encodeURIComponent(input.dimension_key)}/search`,
        { query: input.query },
      );
      return formatToolResponse(result);
    },
  };
