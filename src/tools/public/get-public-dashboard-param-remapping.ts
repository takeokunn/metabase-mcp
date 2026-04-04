import type { MetabaseClient } from '@src/client';
import {
  type GetPublicDashboardParamRemapping,
  GetPublicDashboardParamRemappingSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicDashboardParamRemappingDefinition: ToolDefinition<GetPublicDashboardParamRemapping> =
  {
    name: 'get_public_dashboard_param_remapping',
    description: 'Get remapping for a parameter of a public dashboard in Metabase',
    inputSchema: GetPublicDashboardParamRemappingSchema,
    handler: async (client: MetabaseClient, input: GetPublicDashboardParamRemapping) => {
      const result = await client.get(
        `/api/public/dashboard/${input.uuid}/params/${input.param_key}/remapping`,
      );
      return formatToolResponse(result);
    },
  };
