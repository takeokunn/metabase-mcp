import type { MetabaseClient } from '@src/client';
import { type ListUserNamespaceParams, ListUserNamespaceParamsSchema } from '@src/schemas/user-key-value';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listUserNamespaceValuesDefinition: ToolDefinition<ListUserNamespaceParams> = {
  name: 'list_user_namespace_values',
  description: 'List all key-value pairs in a per-user namespace',
  inputSchema: ListUserNamespaceParamsSchema,
  handler: async (client: MetabaseClient, input: ListUserNamespaceParams) => {
    const result = await client.get(`/api/user-key-value/namespace/${encodeURIComponent(input.namespace)}`);
    return formatToolResponse(result);
  },
};
