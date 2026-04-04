import type { MetabaseClient } from '@src/client';
import {
  type GetEmbedDashboardParamsValues,
  GetEmbedDashboardParamsValuesSchema,
} from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedDashboardParamsDefinition: ToolDefinition<GetEmbedDashboardParamsValues> = {
  name: 'get_embed_dashboard_params',
  description: 'Get values for a parameter in an embedded dashboard from Metabase',
  inputSchema: GetEmbedDashboardParamsValuesSchema,
  handler: async (client: MetabaseClient, input: GetEmbedDashboardParamsValues) => {
    const result = await client.get(
      `/api/embed/dashboard/${input.token}/params/${input.param_key}/values`,
    );
    return formatToolResponse(result);
  },
};
