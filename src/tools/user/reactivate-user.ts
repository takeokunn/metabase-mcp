import type { MetabaseClient } from '@src/client';
import { type ReactivateUserInput, ReactivateUserInputSchema } from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for reactivating a deactivated user
 */
export const reactivateUserDefinition: ToolDefinition<ReactivateUserInput> = {
  name: 'reactivate_user',
  description: 'Reactivate a previously deactivated user in Metabase',
  inputSchema: ReactivateUserInputSchema,
  handler: async (client: MetabaseClient, input: ReactivateUserInput) => {
    const result = await client.put(`/api/user/${input.id}/reactivate`);
    return formatToolResponse(result);
  },
};
