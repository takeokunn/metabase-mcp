import type { MetabaseClient } from '@src/client';
import { type DeleteCollectionInput, DeleteCollectionInputSchema } from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for archiving (soft-deleting) a collection in Metabase
 */
export const deleteCollectionDefinition: ToolDefinition<DeleteCollectionInput> = {
  name: 'delete_collection',
  description: 'Archive (soft-delete) a collection in Metabase',
  inputSchema: DeleteCollectionInputSchema,
  handler: async (client: MetabaseClient, input: DeleteCollectionInput) => {
    const result = await client.put(`/api/collection/${input.id}`, {
      archived: true,
    });
    return formatToolResponse(result);
  },
};
