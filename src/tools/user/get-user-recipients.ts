import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing users eligible as notification recipients
 */
export const getUserRecipientsDefinition: ToolDefinition = {
  name: 'get_user_recipients',
  description:
    'Get a list of users who are eligible to receive notifications and alerts in Metabase.',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/user/recipients');
    return formatToolResponse(result);
  },
};
