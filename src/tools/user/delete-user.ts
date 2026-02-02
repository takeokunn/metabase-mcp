import type { MetabaseClient } from '@src/client';
import { type DeleteUserInput, DeleteUserInputSchema } from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting (deactivating) a user from Metabase
 */
export const deleteUserDefinition: ToolDefinition<DeleteUserInput> = {
  name: 'delete_user',
  description: 'Delete (deactivate) a user from Metabase',
  inputSchema: DeleteUserInputSchema,
  handler: async (client: MetabaseClient, input: DeleteUserInput) => {
    const result = await client.delete(`/api/user/${input.id}`);
    return formatToolResponse(result);
  },
};
