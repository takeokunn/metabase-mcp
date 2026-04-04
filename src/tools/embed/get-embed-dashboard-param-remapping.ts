import type { MetabaseClient } from '@src/client';
import {
  type GetEmbedDashboardParamRemapping,
  GetEmbedDashboardParamRemappingSchema,
} from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedDashboardParamRemappingDefinition: ToolDefinition<GetEmbedDashboardParamRemapping> =
  {
    name: 'get_embed_dashboard_param_remapping',
    description: 'Get remapping for a parameter of an embedded dashboard in Metabase',
    inputSchema: GetEmbedDashboardParamRemappingSchema,
    handler: async (client: MetabaseClient, input: GetEmbedDashboardParamRemapping) => {
      const result = await client.get(
        `/api/embed/dashboard/${input.token}/params/${input.param_key}/remapping`,
      );
      return formatToolResponse(result);
    },
  };
