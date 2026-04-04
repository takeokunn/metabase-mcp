import type { MetabaseClient } from '@src/client';
import {
  type GetPublicDashboardParamValues,
  GetPublicDashboardParamValuesSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicDashboardParamValuesDefinition: ToolDefinition<GetPublicDashboardParamValues> =
  {
    name: 'get_public_dashboard_param_values',
    description: 'Get values for a parameter of a public dashboard in Metabase',
    inputSchema: GetPublicDashboardParamValuesSchema,
    handler: async (client: MetabaseClient, input: GetPublicDashboardParamValues) => {
      const result = await client.get(
        `/api/public/dashboard/${input.uuid}/params/${input.param_key}/values`,
      );
      return formatToolResponse(result);
    },
  };
