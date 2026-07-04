import type { MetabaseClient } from '@src/client';
import {
  type SearchMeasureDimensionValuesParams,
  SearchMeasureDimensionValuesParamsSchema,
} from '@src/schemas/measure';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for searching values for a dimension of a measure in Metabase
 */
export const searchMeasureDimensionValuesDefinition: ToolDefinition<SearchMeasureDimensionValuesParams> =
  {
    name: 'search_measure_dimension_values',
    description: 'Search values for a dimension of a measure in Metabase',
    inputSchema: SearchMeasureDimensionValuesParamsSchema,
    handler: async (client: MetabaseClient, input: SearchMeasureDimensionValuesParams) => {
      const result = await client.get(
        `/api/measure/${input.id}/dimension/${encodeURIComponent(input.dimension_key)}/search`,
        { query: input.query },
      );
      return formatToolResponse(result);
    },
  };
