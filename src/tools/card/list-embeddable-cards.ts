import type { MetabaseClient } from '@src/client';
import { type ListEmbeddableCardsParams, ListEmbeddableCardsParamsSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all cards available for embedding in Metabase (admin only)
 */
export const listEmbeddableCardsDefinition: ToolDefinition<ListEmbeddableCardsParams> = {
  name: 'list_embeddable_cards',
  description: 'List all cards (saved questions) available for embedding in Metabase (admin only)',
  inputSchema: ListEmbeddableCardsParamsSchema,
  handler: async (client: MetabaseClient, _input: ListEmbeddableCardsParams) => {
    const result = await client.get('/api/card/embeddable');
    return formatToolResponse(result);
  },
};
