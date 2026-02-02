import type { MetabaseClient } from '@src/client';
import { type GetUserInput, GetUserInputSchema } from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single user by ID
 */
export const getUserDefinition: ToolDefinition<GetUserInput> = {
  name: 'get_user',
  description: 'Get a single user by ID from Metabase',
  inputSchema: GetUserInputSchema,
  handler: async (client: MetabaseClient, input: GetUserInput) => {
    const result = await client.get(`/api/user/${input.id}`);
    return formatToolResponse(result);
  },
};
