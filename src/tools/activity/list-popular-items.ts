import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listPopularItemsDefinition: ToolDefinition = {
  name: 'list_popular_items',
  description: 'List popular items in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/activity/popular_items');
    return formatToolResponse(result);
  },
};
