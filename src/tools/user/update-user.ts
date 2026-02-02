import type { MetabaseClient } from '@src/client';
import { type UpdateUserInput, UpdateUserInputSchema } from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating an existing user in Metabase
 */
export const updateUserDefinition: ToolDefinition<UpdateUserInput> = {
  name: 'update_user',
  description: 'Update an existing user in Metabase',
  inputSchema: UpdateUserInputSchema,
  handler: async (client: MetabaseClient, input: UpdateUserInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/user/${id}`, updateData);
    return formatToolResponse(result);
  },
};
