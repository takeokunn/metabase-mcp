import type { MetabaseClient } from '@src/client';
import { type UpdateMembershipInput, UpdateMembershipInputSchema } from '@src/schemas/permissions';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a permission group membership in Metabase
 */
export const updateMembershipDefinition: ToolDefinition<UpdateMembershipInput> = {
  name: 'update_membership',
  description: 'Update a permission group membership in Metabase',
  inputSchema: UpdateMembershipInputSchema,
  handler: async (client: MetabaseClient, input: UpdateMembershipInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/permissions/membership/${id}`, updateData);
    return formatToolResponse(result);
  },
};
