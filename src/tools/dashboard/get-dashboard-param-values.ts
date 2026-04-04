import type { MetabaseClient } from '@src/client';
import {
  type GetDashboardParamValuesParams,
  GetDashboardParamValuesParamsSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting possible values for a dashboard filter parameter in Metabase
 */
export const getDashboardParamValuesDefinition: ToolDefinition<GetDashboardParamValuesParams> = {
  name: 'get_dashboard_param_values',
  description: 'Get possible values for a dashboard filter parameter in Metabase',
  inputSchema: GetDashboardParamValuesParamsSchema,
  handler: async (client: MetabaseClient, input: GetDashboardParamValuesParams) => {
    const result = await client.get(
      `/api/dashboard/${input.id}/params/${encodeURIComponent(input.param_key)}/values`,
    );
    return formatToolResponse(result);
  },
};
