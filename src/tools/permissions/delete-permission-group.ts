import type { MetabaseClient } from '@src/client';
import {
  type DeletePermissionGroupInput,
  DeletePermissionGroupInputSchema,
} from '@src/schemas/permissions';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a permission group from Metabase
 */
export const deletePermissionGroupDefinition: ToolDefinition<DeletePermissionGroupInput> = {
  name: 'delete_permission_group',
  description: 'Delete a permission group from Metabase',
  inputSchema: DeletePermissionGroupInputSchema,
  handler: async (client: MetabaseClient, input: DeletePermissionGroupInput) => {
    const result = await client.delete(`/api/permissions/group/${input.id}`);
    return formatToolResponse(result);
  },
};
