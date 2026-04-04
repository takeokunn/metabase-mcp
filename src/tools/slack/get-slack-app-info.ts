import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getSlackAppInfoDefinition: ToolDefinition = {
  name: 'get_slack_app_info',
  description: '[Requires Metabase Pro] Get Slack app information from Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/slack/app-info');
    return formatToolResponse(result);
  },
};
