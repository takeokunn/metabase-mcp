import type { MetabaseClient } from '@src/client';
import {
  type RunPreviewEmbedDashboardPivotQuery,
  RunPreviewEmbedDashboardPivotQuerySchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runPreviewEmbedDashboardPivotQueryDefinition: ToolDefinition<RunPreviewEmbedDashboardPivotQuery> =
  {
    name: 'run_preview_embed_dashboard_pivot_query',
    description: 'Run a pivot query for a preview embedded dashboard dashcard in Metabase',
    inputSchema: RunPreviewEmbedDashboardPivotQuerySchema,
    handler: async (client: MetabaseClient, input: RunPreviewEmbedDashboardPivotQuery) => {
      const result = await client.post(
        `/api/preview_embed/pivot/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
        {},
      );
      return formatToolResponse(result);
    },
  };
