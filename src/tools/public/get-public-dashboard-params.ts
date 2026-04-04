import type { MetabaseClient } from '@src/client';
import {
  type GetPublicDashboardParamsValues,
  GetPublicDashboardParamsValuesSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicDashboardParamsDefinition: ToolDefinition<GetPublicDashboardParamsValues> = {
  name: 'get_public_dashboard_params',
  description: 'Get values for a parameter in a publicly shared dashboard from Metabase',
  inputSchema: GetPublicDashboardParamsValuesSchema,
  handler: async (client: MetabaseClient, input: GetPublicDashboardParamsValues) => {
    const result = await client.get(
      `/api/public/dashboard/${input.uuid}/params/${input.param_key}/values`,
    );
    return formatToolResponse(result);
  },
};
