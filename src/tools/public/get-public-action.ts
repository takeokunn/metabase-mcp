import type { MetabaseClient } from '@src/client';
import { type GetPublicAction, GetPublicActionSchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicActionDefinition: ToolDefinition<GetPublicAction> = {
  name: 'get_public_action',
  description: 'Get details of a public action in Metabase',
  inputSchema: GetPublicActionSchema,
  handler: async (client: MetabaseClient, input: GetPublicAction) => {
    const result = await client.get(`/api/public/action/${input.uuid}`);
    return formatToolResponse(result);
  },
};
