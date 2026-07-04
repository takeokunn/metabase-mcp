import type { MetabaseClient } from '@src/client';
import {
  type GetMeasureDimensionValuesParams,
  GetMeasureDimensionValuesParamsSchema,
} from '@src/schemas/measure';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for fetching values for a dimension of a measure in Metabase
 */
export const getMeasureDimensionValuesDefinition: ToolDefinition<GetMeasureDimensionValuesParams> =
  {
    name: 'get_measure_dimension_values',
    description: 'Fetch values for a dimension of a measure in Metabase',
    inputSchema: GetMeasureDimensionValuesParamsSchema,
    handler: async (client: MetabaseClient, input: GetMeasureDimensionValuesParams) => {
      const result = await client.get(
        `/api/measure/${input.id}/dimension/${encodeURIComponent(input.dimension_key)}/values`,
      );
      return formatToolResponse(result);
    },
  };
