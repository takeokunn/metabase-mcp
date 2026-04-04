import type { MetabaseClient } from '@src/client';
import {
  type SearchPublicDashboardParams,
  SearchPublicDashboardParamsSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const searchPublicDashboardParamsDefinition: ToolDefinition<SearchPublicDashboardParams> = {
  name: 'search_public_dashboard_params',
  description:
    'Search parameter values for a parameter in a publicly shared dashboard from Metabase',
  inputSchema: SearchPublicDashboardParamsSchema,
  handler: async (client: MetabaseClient, input: SearchPublicDashboardParams) => {
    const result = await client.get(
      `/api/public/dashboard/${input.uuid}/params/${input.param_key}/search/${input.search_string}`,
    );
    return formatToolResponse(result);
  },
};
