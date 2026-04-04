import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const refreshPremiumTokenDefinition: ToolDefinition = {
  name: 'refresh_premium_token',
  description: '[Requires Metabase Pro] Refresh the Metabase Pro license token',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.post('/api/premium-features/token/refresh');
    return formatToolResponse(result);
  },
};
