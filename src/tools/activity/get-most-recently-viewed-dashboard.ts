import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getMostRecentlyViewedDashboardDefinition: ToolDefinition = {
  name: 'get_most_recently_viewed_dashboard',
  description: 'Get the most recently viewed dashboard in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/activity/most_recently_viewed_dashboard');
    return formatToolResponse(result);
  },
};
