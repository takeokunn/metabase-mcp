import type { MetabaseClient } from '@src/client';
import {
  type RunEmbedDashboardPivotQuery,
  RunEmbedDashboardPivotQuerySchema,
} from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runEmbedDashboardPivotQueryDefinition: ToolDefinition<RunEmbedDashboardPivotQuery> = {
  name: 'run_embed_dashboard_pivot_query',
  description: 'Run a pivot query for an embedded dashboard dashcard in Metabase',
  inputSchema: RunEmbedDashboardPivotQuerySchema,
  handler: async (client: MetabaseClient, input: RunEmbedDashboardPivotQuery) => {
    const result = await client.post(
      `/api/embed/pivot/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
      {},
    );
    return formatToolResponse(result);
  },
};
