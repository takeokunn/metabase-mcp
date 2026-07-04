import type { MetabaseClient } from '@src/client';
import {
  type CreateUserPasswordResetUrlInput,
  CreateUserPasswordResetUrlInputSchema,
} from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for generating a password reset URL for a user in Metabase (admin only)
 */
export const createUserPasswordResetUrlDefinition: ToolDefinition<CreateUserPasswordResetUrlInput> =
  {
    name: 'create_user_password_reset_url',
    description: 'Generate a password reset URL for a user in Metabase (admin only)',
    inputSchema: CreateUserPasswordResetUrlInputSchema,
    handler: async (client: MetabaseClient, input: CreateUserPasswordResetUrlInput) => {
      const result = await client.post(`/api/user/${input.id}/password-reset-url`);
      return formatToolResponse(result);
    },
  };
