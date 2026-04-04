import type { MetabaseClient } from '@src/client';
import {
  type RunPreviewEmbedDashboardPivotDashcardQuery,
  RunPreviewEmbedDashboardPivotDashcardQuerySchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runPreviewEmbedDashboardPivotDashcardQueryDefinition: ToolDefinition<RunPreviewEmbedDashboardPivotDashcardQuery> =
  {
    name: 'run_preview_embed_dashboard_pivot_dashcard_query',
    description: 'Run a pivot query for a preview embedded dashboard dashcard in Metabase',
    inputSchema: RunPreviewEmbedDashboardPivotDashcardQuerySchema,
    handler: async (client: MetabaseClient, input: RunPreviewEmbedDashboardPivotDashcardQuery) => {
      const result = await client.get(
        `/api/preview_embed/pivot/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
      );
      return formatToolResponse(result);
    },
  };
