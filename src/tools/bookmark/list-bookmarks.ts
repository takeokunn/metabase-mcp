import type { MetabaseClient } from '@src/client';
import { type ListBookmarksParams, ListBookmarksParamsSchema } from '@src/schemas/bookmark';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all bookmarks for the current user
 */
export const listBookmarksDefinition: ToolDefinition<ListBookmarksParams> = {
  name: 'list_bookmarks',
  description: 'Get list of all bookmarks for the current user in Metabase',
  inputSchema: ListBookmarksParamsSchema,
  handler: async (client: MetabaseClient, _input: ListBookmarksParams) => {
    const bookmarks = await client.get('/api/bookmark');
    return formatToolResponse(bookmarks);
  },
};
