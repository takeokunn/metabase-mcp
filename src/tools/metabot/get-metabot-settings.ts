import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getMetabotSettingsDefinition: ToolDefinition = {
  name: 'get_metabot_settings',
  description: '[Requires Metabase Pro] Retrieve current Metabot settings',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/metabot/settings');
    return formatToolResponse(result);
  },
};
