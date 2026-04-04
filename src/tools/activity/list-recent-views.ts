import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listRecentViewsDefinition: ToolDefinition = {
  name: 'list_recent_views',
  description: 'List recently viewed items in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/activity/recent_views');
    return formatToolResponse(result);
  },
};
