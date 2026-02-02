import type { MetabaseClient } from '@src/client';
import { type ListUsersInput, ListUsersInputSchema } from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all users in Metabase
 */
export const listUsersDefinition: ToolDefinition<ListUsersInput> = {
  name: 'list_users',
  description: 'List all users with optional filtering by status, search query, or group',
  inputSchema: ListUsersInputSchema,
  handler: async (client: MetabaseClient, input: ListUsersInput) => {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.status) params.status = input.status;
    if (input.query) params.query = input.query;
    if (input.group_id) params.group_id = input.group_id;
    if (input.limit) params.limit = input.limit;
    if (input.offset) params.offset = input.offset;

    const result = await client.get('/api/user', params);
    return formatToolResponse(result);
  },
};
