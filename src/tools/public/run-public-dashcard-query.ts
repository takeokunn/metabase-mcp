import type { MetabaseClient } from '@src/client';
import { type RunPublicDashcardQuery, RunPublicDashcardQuerySchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runPublicDashcardQueryDefinition: ToolDefinition<RunPublicDashcardQuery> = {
  name: 'run_public_dashcard_query',
  description: 'Run a query for a public dashboard dashcard in Metabase',
  inputSchema: RunPublicDashcardQuerySchema,
  handler: async (client: MetabaseClient, input: RunPublicDashcardQuery) => {
    const result = await client.post(
      `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
      { parameters: input.parameters ?? [] },
    );
    return formatToolResponse(result);
  },
};
