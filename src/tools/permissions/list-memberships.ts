import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all permission group memberships in Metabase
 */
export const listMembershipsDefinition: ToolDefinition = {
  name: 'list_memberships',
  description: 'List all permission group memberships in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/permissions/membership');
    return formatToolResponse(result);
  },
};
