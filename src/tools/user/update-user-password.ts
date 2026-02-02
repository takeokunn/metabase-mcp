import type { MetabaseClient } from '@src/client';
import { type UpdateUserPasswordInput, UpdateUserPasswordInputSchema } from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a user's password
 */
export const updateUserPasswordDefinition: ToolDefinition<UpdateUserPasswordInput> = {
  name: 'update_user_password',
  description: "Update a user's password in Metabase",
  inputSchema: UpdateUserPasswordInputSchema,
  handler: async (client: MetabaseClient, input: UpdateUserPasswordInput) => {
    const { id, ...passwordData } = input;
    const result = await client.put(`/api/user/${id}/password`, passwordData);
    return formatToolResponse(result);
  },
};
