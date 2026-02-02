import type { MetabaseClient } from '@src/client';
import { type UpdateCardInput, UpdateCardInputSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating an existing card (saved question) in Metabase
 */
export const updateCardDefinition: ToolDefinition<UpdateCardInput> = {
  name: 'update_card',
  description: 'Update an existing card (saved question) in Metabase',
  inputSchema: UpdateCardInputSchema,
  handler: async (client: MetabaseClient, input: UpdateCardInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/card/${id}`, updateData);
    return formatToolResponse(result);
  },
};
