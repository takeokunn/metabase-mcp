import type { MetabaseClient } from '@src/client';
import { type GetCurrentUserInput, GetCurrentUserInputSchema } from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting the current authenticated user
 */
export const getCurrentUserDefinition: ToolDefinition<GetCurrentUserInput> = {
  name: 'get_current_user',
  description: 'Get the currently authenticated user',
  inputSchema: GetCurrentUserInputSchema,
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/user/current');
    return formatToolResponse(result);
  },
};
