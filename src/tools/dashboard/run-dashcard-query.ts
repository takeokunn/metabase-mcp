import type { MetabaseClient } from '@src/client';
import { type RunDashcardQueryInput, RunDashcardQueryInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runDashcardQueryDefinition: ToolDefinition<RunDashcardQueryInput> = {
  name: 'run_dashcard_query',
  description: 'Run the query for a specific card on a dashboard in Metabase',
  inputSchema: RunDashcardQueryInputSchema,
  handler: async (client: MetabaseClient, input: RunDashcardQueryInput) => {
    const result = await client.post(`/api/dashboard/${input.dashboard_id}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`, { parameters: input.parameters ?? [] });
    return formatToolResponse(result);
  },
};
