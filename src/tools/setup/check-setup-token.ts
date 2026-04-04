import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const checkSetupTokenDefinition: ToolDefinition = {
  name: 'check_setup_token',
  description: 'Get the admin setup checklist to verify Metabase initial configuration status',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/setup/admin_checklist');
    return formatToolResponse(result);
  },
};
