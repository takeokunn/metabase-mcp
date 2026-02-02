import type { MetabaseClient } from '@src/client';
import { type UpdateCollectionInput, UpdateCollectionInputSchema } from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a collection in Metabase
 */
export const updateCollectionDefinition: ToolDefinition<UpdateCollectionInput> = {
  name: 'update_collection',
  description: 'Update an existing collection in Metabase',
  inputSchema: UpdateCollectionInputSchema,
  handler: async (client: MetabaseClient, input: UpdateCollectionInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/collection/${id}`, updateData);
    return formatToolResponse(result);
  },
};
