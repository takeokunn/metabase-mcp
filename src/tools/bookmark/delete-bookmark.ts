import type { MetabaseClient } from '@src/client';
import { type DeleteBookmarkInput, DeleteBookmarkInputSchema } from '@src/schemas/bookmark';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a bookmark from Metabase
 */
export const deleteBookmarkDefinition: ToolDefinition<DeleteBookmarkInput> = {
  name: 'delete_bookmark',
  description: 'Delete a bookmark for a card, dashboard, or collection from Metabase',
  inputSchema: DeleteBookmarkInputSchema,
  handler: async (client: MetabaseClient, input: DeleteBookmarkInput) => {
    const result = await client.delete(`/api/bookmark/${input.model}/${input.id}`);
    return formatToolResponse(result);
  },
};
