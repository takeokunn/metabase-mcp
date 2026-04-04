import type { MetabaseClient } from '@src/client';
import {
  type SearchEmbedDashboardParams,
  SearchEmbedDashboardParamsSchema,
} from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const searchEmbedDashboardParamsDefinition: ToolDefinition<SearchEmbedDashboardParams> = {
  name: 'search_embed_dashboard_params',
  description: 'Search parameter values for a parameter in an embedded dashboard from Metabase',
  inputSchema: SearchEmbedDashboardParamsSchema,
  handler: async (client: MetabaseClient, input: SearchEmbedDashboardParams) => {
    const result = await client.get(
      `/api/embed/dashboard/${input.token}/params/${input.param_key}/search/${input.search_string}`,
    );
    return formatToolResponse(result);
  },
};
