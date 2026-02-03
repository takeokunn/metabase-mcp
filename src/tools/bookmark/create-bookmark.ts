import type { MetabaseClient } from '@src/client';
import { type CreateBookmarkInput, CreateBookmarkInputSchema } from '@src/schemas/bookmark';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a new bookmark in Metabase
 */
export const createBookmarkDefinition: ToolDefinition<CreateBookmarkInput> = {
  name: 'create_bookmark',
  description: 'Create a new bookmark for a card, dashboard, or collection in Metabase',
  inputSchema: CreateBookmarkInputSchema,
  handler: async (client: MetabaseClient, input: CreateBookmarkInput) => {
    const result = await client.post(`/api/bookmark/${input.model}/${input.id}`);
    return formatToolResponse(result);
  },
};
