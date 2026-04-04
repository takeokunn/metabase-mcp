import type { MetabaseClient } from '@src/client';
import { type GetActionParams, GetActionParamsSchema } from '@src/schemas/action';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getActionDefinition: ToolDefinition<GetActionParams> = {
  name: 'get_action',
  description: 'Get an action by ID from Metabase',
  inputSchema: GetActionParamsSchema,
  handler: async (client: MetabaseClient, input: GetActionParams) => {
    const result = await client.get(`/api/action/${input.id}`);
    return formatToolResponse(result);
  },
};
