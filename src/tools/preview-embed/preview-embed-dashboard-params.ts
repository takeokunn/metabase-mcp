import type { MetabaseClient } from '@src/client';
import {
  type PreviewEmbedDashboardParamsValues,
  PreviewEmbedDashboardParamsValuesSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const previewEmbedDashboardParamsDefinition: ToolDefinition<PreviewEmbedDashboardParamsValues> =
  {
    name: 'preview_embed_dashboard_params',
    description:
      'Preview values for a parameter in an embedded dashboard from Metabase (admin only)',
    inputSchema: PreviewEmbedDashboardParamsValuesSchema,
    handler: async (client: MetabaseClient, input: PreviewEmbedDashboardParamsValues) => {
      const result = await client.get(
        `/api/preview_embed/dashboard/${input.token}/params/${input.param_key}/values`,
      );
      return formatToolResponse(result);
    },
  };
