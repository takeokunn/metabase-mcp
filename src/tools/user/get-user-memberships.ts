import type { MetabaseClient } from '@src/client';
import {
  type GetUserMembershipsParams,
  GetUserMembershipsParamsSchema,
} from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting all group memberships for a user
 */
export const getUserMembershipsDefinition: ToolDefinition<GetUserMembershipsParams> = {
  name: 'get_user_memberships',
  description: 'Get all permission group memberships for a specific user by their ID.',
  inputSchema: GetUserMembershipsParamsSchema,
  handler: async (client: MetabaseClient, input: GetUserMembershipsParams) => {
    const result = await client.get(`/api/user/${input.id}/memberships`);
    return formatToolResponse(result);
  },
};
