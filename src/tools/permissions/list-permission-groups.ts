import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all permission groups in Metabase
 */
export const listPermissionGroupsDefinition: ToolDefinition = {
  name: 'list_permission_groups',
  description: 'List all permission groups in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/permissions/group');
    return formatToolResponse(result);
  },
};
