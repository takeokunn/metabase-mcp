import type { MetabaseClient } from '@src/client';
import { type GetDashboardParamRemappingInput, GetDashboardParamRemappingInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getDashboardParamRemappingDefinition: ToolDefinition<GetDashboardParamRemappingInput> = {
  name: 'get_dashboard_param_remapping',
  description: 'Get remapping for a parameter of a dashboard in Metabase',
  inputSchema: GetDashboardParamRemappingInputSchema,
  handler: async (client: MetabaseClient, input: GetDashboardParamRemappingInput) => {
    const result = await client.get(`/api/dashboard/${input.id}/params/${input.param_key}/remapping`);
    return formatToolResponse(result);
  },
};
