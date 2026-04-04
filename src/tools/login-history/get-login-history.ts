import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getLoginHistoryDefinition: ToolDefinition = {
  name: 'get_login_history',
  description: 'Get the current user login history from Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/login-history/current');
    return formatToolResponse(result);
  },
};
