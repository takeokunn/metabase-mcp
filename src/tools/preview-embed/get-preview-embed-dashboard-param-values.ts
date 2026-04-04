import type { MetabaseClient } from '@src/client';
import {
  type GetPreviewEmbedDashboardParamValues,
  GetPreviewEmbedDashboardParamValuesSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPreviewEmbedDashboardParamValuesDefinition: ToolDefinition<GetPreviewEmbedDashboardParamValues> =
  {
    name: 'get_preview_embed_dashboard_param_values',
    description: 'Get values for a parameter of a preview embedded dashboard in Metabase',
    inputSchema: GetPreviewEmbedDashboardParamValuesSchema,
    handler: async (client: MetabaseClient, input: GetPreviewEmbedDashboardParamValues) => {
      const result = await client.get(
        `/api/preview_embed/dashboard/${input.token}/params/${input.param_key}/values`,
      );
      return formatToolResponse(result);
    },
  };
