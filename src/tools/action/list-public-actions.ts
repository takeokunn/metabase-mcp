import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listPublicActionsDefinition: ToolDefinition = {
  name: 'list_public_actions',
  description: 'List all actions with public sharing links in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/action/public');
    return formatToolResponse(result);
  },
};
