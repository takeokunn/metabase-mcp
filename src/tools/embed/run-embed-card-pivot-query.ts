import type { MetabaseClient } from '@src/client';
import { type RunEmbedCardPivotQuery, RunEmbedCardPivotQuerySchema } from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const runEmbedCardPivotQueryDefinition: ToolDefinition<RunEmbedCardPivotQuery> = {
  name: 'run_embed_card_pivot_query',
  description: 'Run a pivot query for an embedded card in Metabase',
  inputSchema: RunEmbedCardPivotQuerySchema,
  handler: async (client: MetabaseClient, input: RunEmbedCardPivotQuery) => {
    const result = await client.get(`/api/embed/pivot/card/${input.token}/query`, {});
    return formatToolResponse(result);
  },
};
