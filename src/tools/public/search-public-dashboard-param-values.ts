import type { MetabaseClient } from '@src/client';
import {
  type SearchPublicDashboardParamValues,
  SearchPublicDashboardParamValuesSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const searchPublicDashboardParamValuesDefinition: ToolDefinition<SearchPublicDashboardParamValues> =
  {
    name: 'search_public_dashboard_param_values',
    description: 'Search values for a parameter of a public dashboard in Metabase',
    inputSchema: SearchPublicDashboardParamValuesSchema,
    handler: async (client: MetabaseClient, input: SearchPublicDashboardParamValues) => {
      const result = await client.get(
        `/api/public/dashboard/${input.uuid}/params/${input.param_key}/search/${input.query}`,
      );
      return formatToolResponse(result);
    },
  };
