import type { MetabaseClient } from '@src/client';
import { type UserKeyValueParams, UserKeyValueParamsSchema } from '@src/schemas/user-key-value';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deleteUserKeyValueDefinition: ToolDefinition<UserKeyValueParams> = {
  name: 'delete_user_key_value',
  description: 'Delete a per-user key-value preference by namespace and key',
  inputSchema: UserKeyValueParamsSchema,
  handler: async (client: MetabaseClient, input: UserKeyValueParams) => {
    const result = await client.delete(
      `/api/user-key-value/namespace/${encodeURIComponent(input.namespace)}/key/${encodeURIComponent(input.key)}`,
    );
    return formatToolResponse(result);
  },
};
