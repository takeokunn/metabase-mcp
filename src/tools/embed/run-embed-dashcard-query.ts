import type { MetabaseClient } from '@src/client';
import { type RunEmbedDashcardQuery, RunEmbedDashcardQuerySchema } from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runEmbedDashcardQueryDefinition: ToolDefinition<RunEmbedDashcardQuery> = {
  name: 'run_embed_dashcard_query',
  description: 'Run a query for an embedded dashcard in Metabase',
  inputSchema: RunEmbedDashcardQuerySchema,
  handler: async (client: MetabaseClient, input: RunEmbedDashcardQuery) => {
    const result = await client.get(
      `/api/embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}`,
    );
    return formatToolResponse(result);
  },
};
