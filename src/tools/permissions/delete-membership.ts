import type { MetabaseClient } from '@src/client';
import {
  type DeleteMembershipParams,
  DeleteMembershipParamsSchema,
} from '@src/schemas/permissions';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a permission group membership in Metabase
 */
export const deleteMembershipDefinition: ToolDefinition<DeleteMembershipParams> = {
  name: 'delete_membership',
  description: 'Delete a permission group membership in Metabase',
  inputSchema: DeleteMembershipParamsSchema,
  handler: async (client: MetabaseClient, input: DeleteMembershipParams) => {
    const result = await client.delete(`/api/permissions/membership/${input.id}`);
    return formatToolResponse(result);
  },
};
