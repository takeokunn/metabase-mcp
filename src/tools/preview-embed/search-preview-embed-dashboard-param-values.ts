import type { MetabaseClient } from '@src/client';
import {
  type SearchPreviewEmbedDashboardParamValues,
  SearchPreviewEmbedDashboardParamValuesSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const searchPreviewEmbedDashboardParamValuesDefinition: ToolDefinition<SearchPreviewEmbedDashboardParamValues> =
  {
    name: 'search_preview_embed_dashboard_param_values',
    description: 'Search values for a parameter of a preview embedded dashboard in Metabase',
    inputSchema: SearchPreviewEmbedDashboardParamValuesSchema,
    handler: async (client: MetabaseClient, input: SearchPreviewEmbedDashboardParamValues) => {
      const result = await client.get(
        `/api/preview_embed/dashboard/${input.token}/params/${input.param_key}/search/${input.query}`,
      );
      return formatToolResponse(result);
    },
  };
