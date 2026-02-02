import type { MetabaseClient } from '@src/client';
import { type DeleteCardInput, DeleteCardInputSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a card (saved question) from Metabase
 */
export const deleteCardDefinition: ToolDefinition<DeleteCardInput> = {
  name: 'delete_card',
  description: 'Delete a card (saved question) from Metabase',
  inputSchema: DeleteCardInputSchema,
  handler: async (client: MetabaseClient, input: DeleteCardInput) => {
    const result = await client.delete(`/api/card/${input.id}`);
    return formatToolResponse(result);
  },
};
