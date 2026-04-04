import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for counting total users (used for pagination)
 */
export const countUsersDefinition: ToolDefinition = {
  name: 'count_users',
  description:
    'Get the total count of users in Metabase. Useful for pagination when listing users.',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/user/count');
    return formatToolResponse(result);
  },
};
