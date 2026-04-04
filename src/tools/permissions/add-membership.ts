import type { MetabaseClient } from '@src/client';
import { type AddMembershipInput, AddMembershipInputSchema } from '@src/schemas/permissions';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for adding a user to a permission group in Metabase
 */
export const addMembershipDefinition: ToolDefinition<AddMembershipInput> = {
  name: 'add_membership',
  description: 'Add a user to a permission group in Metabase',
  inputSchema: AddMembershipInputSchema,
  handler: async (client: MetabaseClient, input: AddMembershipInput) => {
    const result = await client.post('/api/permissions/membership', {
      user_id: input.user_id,
      group_id: input.group_id,
    });
    return formatToolResponse(result);
  },
};
