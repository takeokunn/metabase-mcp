import type { MetabaseClient } from '@src/client';
import {
  type DeleteCardPublicLinkInput,
  DeleteCardPublicLinkInputSchema,
} from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a public sharing link from a card in Metabase
 */
export const deleteCardPublicLinkDefinition: ToolDefinition<DeleteCardPublicLinkInput> = {
  name: 'delete_card_public_link',
  description: 'Delete a public sharing link from a card (saved question) in Metabase',
  inputSchema: DeleteCardPublicLinkInputSchema,
  handler: async (client: MetabaseClient, input: DeleteCardPublicLinkInput) => {
    const result = await client.delete(`/api/card/${input.id}/public_link`);
    return formatToolResponse(result);
  },
};
