import type { MetabaseClient } from '@src/client';
import { type ClearMembershipsParams, ClearMembershipsParamsSchema } from '@src/schemas/permissions';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for removing all users from a permission group in Metabase
 */
export const clearMembershipsDefinition: ToolDefinition<ClearMembershipsParams> = {
  name: 'clear_memberships',
  description: 'Remove all users from a permission group in Metabase',
  inputSchema: ClearMembershipsParamsSchema,
  handler: async (client: MetabaseClient, input: ClearMembershipsParams) => {
    const result = await client.put(`/api/permissions/membership/${input.group_id}/clear`);
    return formatToolResponse(result);
  },
};
