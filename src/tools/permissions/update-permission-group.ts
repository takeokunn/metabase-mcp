import type { MetabaseClient } from '@src/client';
import {
  type UpdatePermissionGroupInput,
  UpdatePermissionGroupInputSchema,
} from '@src/schemas/permissions';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a permission group in Metabase
 */
export const updatePermissionGroupDefinition: ToolDefinition<UpdatePermissionGroupInput> = {
  name: 'update_permission_group',
  description: 'Update an existing permission group in Metabase',
  inputSchema: UpdatePermissionGroupInputSchema,
  handler: async (client: MetabaseClient, input: UpdatePermissionGroupInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/permissions/group/${id}`, updateData);
    return formatToolResponse(result);
  },
};
