import type { MetabaseClient } from '@src/client';
import {
  type GetEmbedDashboardParamValues,
  GetEmbedDashboardParamValuesSchema,
} from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedDashboardParamValuesDefinition: ToolDefinition<GetEmbedDashboardParamValues> =
  {
    name: 'get_embed_dashboard_param_values',
    description: 'Get values for a parameter of an embedded dashboard in Metabase',
    inputSchema: GetEmbedDashboardParamValuesSchema,
    handler: async (client: MetabaseClient, input: GetEmbedDashboardParamValues) => {
      const result = await client.get(
        `/api/embed/dashboard/${input.token}/params/${input.param_key}/values`,
      );
      return formatToolResponse(result);
    },
  };
