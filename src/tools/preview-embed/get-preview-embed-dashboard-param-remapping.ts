import type { MetabaseClient } from '@src/client';
import {
  type GetPreviewEmbedDashboardParamRemapping,
  GetPreviewEmbedDashboardParamRemappingSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPreviewEmbedDashboardParamRemappingDefinition: ToolDefinition<GetPreviewEmbedDashboardParamRemapping> =
  {
    name: 'get_preview_embed_dashboard_param_remapping',
    description: 'Get remapping for a parameter of a preview embedded dashboard in Metabase',
    inputSchema: GetPreviewEmbedDashboardParamRemappingSchema,
    handler: async (client: MetabaseClient, input: GetPreviewEmbedDashboardParamRemapping) => {
      const result = await client.get(
        `/api/preview_embed/dashboard/${input.token}/params/${input.param_key}/remapping`,
      );
      return formatToolResponse(result);
    },
  };
