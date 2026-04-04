import type { MetabaseClient } from '@src/client';
import {
  type SearchEmbedDashboardParamValues,
  SearchEmbedDashboardParamValuesSchema,
} from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const searchEmbedDashboardParamValuesDefinition: ToolDefinition<SearchEmbedDashboardParamValues> =
  {
    name: 'search_embed_dashboard_param_values',
    description: 'Search values for a parameter of an embedded dashboard in Metabase',
    inputSchema: SearchEmbedDashboardParamValuesSchema,
    handler: async (client: MetabaseClient, input: SearchEmbedDashboardParamValues) => {
      const result = await client.get(
        `/api/embed/dashboard/${input.token}/params/${input.param_key}/search/${input.query}`,
      );
      return formatToolResponse(result);
    },
  };
