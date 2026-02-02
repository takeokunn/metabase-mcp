import type { MetabaseClient } from '@src/client';
import {
  type CreatePermissionGroupInput,
  CreatePermissionGroupInputSchema,
} from '@src/schemas/permissions';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a new permission group in Metabase
 */
export const createPermissionGroupDefinition: ToolDefinition<CreatePermissionGroupInput> = {
  name: 'create_permission_group',
  description: 'Create a new permission group in Metabase',
  inputSchema: CreatePermissionGroupInputSchema,
  handler: async (client: MetabaseClient, input: CreatePermissionGroupInput) => {
    const result = await client.post('/api/permissions/group', {
      name: input.name,
    });
    return formatToolResponse(result);
  },
};
