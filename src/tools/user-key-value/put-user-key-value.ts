import type { MetabaseClient } from '@src/client';
import { type PutUserKeyValueInput, PutUserKeyValueInputSchema } from '@src/schemas/user-key-value';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const putUserKeyValueDefinition: ToolDefinition<PutUserKeyValueInput> = {
  name: 'put_user_key_value',
  description: 'Store a per-user key-value preference by namespace and key',
  inputSchema: PutUserKeyValueInputSchema,
  handler: async (client: MetabaseClient, input: PutUserKeyValueInput) => {
    const result = await client.put(
      `/api/user-key-value/namespace/${encodeURIComponent(input.namespace)}/key/${encodeURIComponent(input.key)}`,
      input.value,
    );
    return formatToolResponse(result);
  },
};
