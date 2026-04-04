import type { MetabaseClient } from '@src/client';
import {
  type RunPublicDashboardPivotQuery,
  RunPublicDashboardPivotQuerySchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runPublicDashboardPivotQueryDefinition: ToolDefinition<RunPublicDashboardPivotQuery> =
  {
    name: 'run_public_dashboard_pivot_query',
    description: 'Run a pivot query for a public dashboard dashcard in Metabase',
    inputSchema: RunPublicDashboardPivotQuerySchema,
    handler: async (client: MetabaseClient, input: RunPublicDashboardPivotQuery) => {
      const result = await client.post(
        `/api/public/pivot/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
        { parameters: input.parameters ?? [] },
      );
      return formatToolResponse(result);
    },
  };
