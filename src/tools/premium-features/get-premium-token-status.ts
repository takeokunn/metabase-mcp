import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPremiumTokenStatusDefinition: ToolDefinition = {
  name: 'get_premium_token_status',
  description: '[Requires Metabase Pro] Get the status of the current Metabase Pro license token',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/premium-features/token/status');
    return formatToolResponse(result);
  },
};
