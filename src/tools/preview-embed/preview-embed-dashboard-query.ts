import type { MetabaseClient } from '@src/client';
import {
  type PreviewEmbedDashboardQueryParams,
  PreviewEmbedDashboardQueryParamsSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const previewEmbedDashboardQueryDefinition: ToolDefinition<PreviewEmbedDashboardQueryParams> =
  {
    name: 'preview_embed_dashboard_query',
    description:
      'Preview query results for a dashcard in an embedded dashboard from Metabase (admin only)',
    inputSchema: PreviewEmbedDashboardQueryParamsSchema,
    handler: async (client: MetabaseClient, input: PreviewEmbedDashboardQueryParams) => {
      const result = await client.get(
        `/api/preview_embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
      );
      return formatToolResponse(result);
    },
  };
