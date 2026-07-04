import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting information about the configured Slack app in Metabase
 */
export const getSlackAppInfoDefinition: ToolDefinition = {
  name: 'get_slack_app_info',
  description: 'Get information about the configured Slack app in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/slack/app-info');
    return formatToolResponse(result);
  },
};
