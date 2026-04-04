import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for retrieving anonymous usage statistics
 */
export const getAnalyticsStatsDefinition: ToolDefinition = {
  name: 'get_analytics_stats',
  description:
    'Retrieve anonymous usage statistics from Metabase. Returns aggregated analytics data about how Metabase is being used.',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/analytics/anonymous-stats');
    return formatToolResponse(result);
  },
};
