import type { MetabaseClient } from '@src/client';
import { type ListPublicCardsParams, ListPublicCardsParamsSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all cards with public sharing links in Metabase (admin only)
 */
export const listPublicCardsDefinition: ToolDefinition<ListPublicCardsParams> = {
  name: 'list_public_cards',
  description: 'List all cards (saved questions) with public sharing links in Metabase (admin only)',
  inputSchema: ListPublicCardsParamsSchema,
  handler: async (client: MetabaseClient, _input: ListPublicCardsParams) => {
    const result = await client.get('/api/card/public');
    return formatToolResponse(result);
  },
};
