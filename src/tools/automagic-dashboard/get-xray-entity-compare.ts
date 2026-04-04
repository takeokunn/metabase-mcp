import type { MetabaseClient } from '@src/client';
import {
  type GetXrayEntityCompareInput,
  GetXrayEntityCompareInputSchema,
} from '@src/schemas/automagic-dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getXrayEntityCompareDefinition: ToolDefinition<GetXrayEntityCompareInput> = {
  name: 'get_xray_entity_compare',
  description: 'Get a comparison x-ray automagic dashboard for an entity in Metabase',
  inputSchema: GetXrayEntityCompareInputSchema,
  handler: async (client: MetabaseClient, input: GetXrayEntityCompareInput) => {
    const result = await client.get(
      `/api/automagic-dashboards/${input.entity}/${input.entity_id_or_query}/compare/${input.comparison_entity}/${input.comparison_entity_id_or_query}`,
    );
    return formatToolResponse(result);
  },
};
