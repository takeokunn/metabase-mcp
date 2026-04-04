import type { MetabaseClient } from '@src/client';
import {
  type ExecuteDashboardCardQueryInput,
  ExecuteDashboardCardQueryInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for executing a dashcard query with dashboard filter parameters in Metabase
 */
export const executeDashboardCardQueryDefinition: ToolDefinition<ExecuteDashboardCardQueryInput> = {
  name: 'execute_dashboard_card_query',
  description: 'Execute a dashcard query with dashboard filter parameters in Metabase',
  inputSchema: ExecuteDashboardCardQueryInputSchema,
  handler: async (client: MetabaseClient, input: ExecuteDashboardCardQueryInput) => {
    const result = await client.post(
      `/api/dashboard/${input.id}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
      { parameters: input.parameters ?? [] },
    );
    return formatToolResponse(result);
  },
};
