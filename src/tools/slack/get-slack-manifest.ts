import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getSlackManifestDefinition: ToolDefinition = {
  name: 'get_slack_manifest',
  description: '[Requires Metabase Pro] Get the Slack app manifest from Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/slack/manifest');
    return formatToolResponse(result);
  },
};
