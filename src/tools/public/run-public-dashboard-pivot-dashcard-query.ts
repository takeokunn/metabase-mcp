import type { MetabaseClient } from '@src/client';
import {
  type RunPublicDashboardPivotDashcardQuery,
  RunPublicDashboardPivotDashcardQuerySchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runPublicDashboardPivotDashcardQueryDefinition: ToolDefinition<RunPublicDashboardPivotDashcardQuery> =
  {
    name: 'run_public_dashboard_pivot_dashcard_query',
    description: 'Run a pivot query for a public dashboard dashcard in Metabase',
    inputSchema: RunPublicDashboardPivotDashcardQuerySchema,
    handler: async (client: MetabaseClient, input: RunPublicDashboardPivotDashcardQuery) => {
      const result = await client.get(
        `/api/public/pivot/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}`,
      );
      return formatToolResponse(result);
    },
  };
