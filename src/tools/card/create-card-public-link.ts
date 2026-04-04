import type { MetabaseClient } from '@src/client';
import { type CreateCardPublicLinkInput, CreateCardPublicLinkInputSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a public sharing link for a card in Metabase
 */
export const createCardPublicLinkDefinition: ToolDefinition<CreateCardPublicLinkInput> = {
  name: 'create_card_public_link',
  description:
    'Create a public sharing link for a card (saved question) in Metabase (returns UUID)',
  inputSchema: CreateCardPublicLinkInputSchema,
  handler: async (client: MetabaseClient, input: CreateCardPublicLinkInput) => {
    const result = await client.post(`/api/card/${input.id}/public_link`, {});
    return formatToolResponse(result);
  },
};
