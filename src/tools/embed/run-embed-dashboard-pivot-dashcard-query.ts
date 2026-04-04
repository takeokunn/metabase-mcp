import type { MetabaseClient } from '@src/client';
import {
  type RunEmbedDashboardPivotDashcardQuery,
  RunEmbedDashboardPivotDashcardQuerySchema,
} from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runEmbedDashboardPivotDashcardQueryDefinition: ToolDefinition<RunEmbedDashboardPivotDashcardQuery> =
  {
    name: 'run_embed_dashboard_pivot_dashcard_query',
    description: 'Run a pivot query for an embedded dashboard dashcard in Metabase',
    inputSchema: RunEmbedDashboardPivotDashcardQuerySchema,
    handler: async (client: MetabaseClient, input: RunEmbedDashboardPivotDashcardQuery) => {
      const result = await client.get(
        `/api/embed/pivot/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}`,
      );
      return formatToolResponse(result);
    },
  };
