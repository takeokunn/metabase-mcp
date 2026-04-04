import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all settings in Metabase
 */
export const listSettingsDefinition: ToolDefinition = {
  name: 'list_settings',
  description: 'List all settings in Metabase (admin only)',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/setting');
    return formatToolResponse(result);
  },
};
