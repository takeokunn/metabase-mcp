import type { MetabaseClient } from '@src/client';
import { type PivotDashcardQueryInput, PivotDashcardQueryInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const pivotDashcardQueryDefinition: ToolDefinition<PivotDashcardQueryInput> = {
  name: 'pivot_dashcard_query',
  description: 'Run a pivot query for a specific dashcard in Metabase',
  inputSchema: PivotDashcardQueryInputSchema,
  handler: async (client: MetabaseClient, input: PivotDashcardQueryInput) => {
    const result = await client.post(`/api/dashboard/pivot/${input.dashboard_id}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`, { parameters: input.parameters ?? [] });
    return formatToolResponse(result);
  },
};
