import type { MetabaseClient } from '@src/client';
import { type CreateUserInput, CreateUserInputSchema } from '@src/schemas/user';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a new user in Metabase
 */
export const createUserDefinition: ToolDefinition<CreateUserInput> = {
  name: 'create_user',
  description: 'Create a new user in Metabase',
  inputSchema: CreateUserInputSchema,
  handler: async (client: MetabaseClient, input: CreateUserInput) => {
    const result = await client.post('/api/user', {
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email,
      password: input.password,
      group_ids: input.group_ids,
      login_attributes: input.login_attributes,
    });
    return formatToolResponse(result);
  },
};
