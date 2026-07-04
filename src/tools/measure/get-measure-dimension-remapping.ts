import type { MetabaseClient } from '@src/client';
import {
  type GetMeasureDimensionRemappingParams,
  GetMeasureDimensionRemappingParamsSchema,
} from '@src/schemas/measure';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for fetching the remapping of a dimension value of a measure in Metabase
 */
export const getMeasureDimensionRemappingDefinition: ToolDefinition<GetMeasureDimensionRemappingParams> =
  {
    name: 'get_measure_dimension_remapping',
    description: 'Fetch the remapping for a dimension value of a measure in Metabase',
    inputSchema: GetMeasureDimensionRemappingParamsSchema,
    handler: async (client: MetabaseClient, input: GetMeasureDimensionRemappingParams) => {
      const result = await client.get(
        `/api/measure/${input.id}/dimension/${encodeURIComponent(input.dimension_key)}/remapping`,
        { value: input.value },
      );
      return formatToolResponse(result);
    },
  };
