import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all notification channels in Metabase
 */
export const listChannelsDefinition: ToolDefinition = {
  name: 'list_channels',
  description: 'List all notification channels in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/channel');
    return formatToolResponse(result);
  },
};
