import type { MetabaseClient } from '@src/client';
import {
  type GetPermissionGroupInput,
  GetPermissionGroupInputSchema,
} from '@src/schemas/permissions';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single permission group by ID
 */
export const getPermissionGroupDefinition: ToolDefinition<GetPermissionGroupInput> = {
  name: 'get_permission_group',
  description: 'Get a single permission group by ID from Metabase',
  inputSchema: GetPermissionGroupInputSchema,
  handler: async (client: MetabaseClient, input: GetPermissionGroupInput) => {
    const result = await client.get(`/api/permissions/group/${input.id}`);
    return formatToolResponse(result);
  },
};
