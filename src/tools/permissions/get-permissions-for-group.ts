import type { MetabaseClient } from '@src/client';
import {
  type GetGroupPermissionsParams,
  GetGroupPermissionsParamsSchema,
} from '@src/schemas/permissions';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting permissions for a specific group in Metabase
 */
export const getPermissionsForGroupDefinition: ToolDefinition<GetGroupPermissionsParams> = {
  name: 'get_permissions_for_group',
  description: 'Get permissions for a specific permission group in Metabase',
  inputSchema: GetGroupPermissionsParamsSchema,
  handler: async (client: MetabaseClient, input: GetGroupPermissionsParams) => {
    const result = await client.get(`/api/permissions/graph/group/${input.group_id}`);
    return formatToolResponse(result);
  },
};
