import type { MetabaseClient } from '@src/client';
import { type ReorderBookmarksInput, ReorderBookmarksInputSchema } from '@src/schemas/bookmark';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for reordering bookmarks in Metabase
 */
export const reorderBookmarksDefinition: ToolDefinition<ReorderBookmarksInput> = {
  name: 'reorder_bookmarks',
  description: 'Reorder bookmarks by providing the new ordering for the current user',
  inputSchema: ReorderBookmarksInputSchema,
  handler: async (client: MetabaseClient, input: ReorderBookmarksInput) => {
    const result = await client.put('/api/bookmark/ordering', {
      orderings: input.orderings,
    });
    return formatToolResponse(result);
  },
};
