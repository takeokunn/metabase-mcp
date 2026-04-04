import type { MetabaseClient } from '@src/client';
import {
  type GetActionExecuteFormParams,
  GetActionExecuteFormParamsSchema,
} from '@src/schemas/action';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getActionExecuteFormDefinition: ToolDefinition<GetActionExecuteFormParams> = {
  name: 'get_action_execute_form',
  description: 'Get the execute form fields for an action in Metabase',
  inputSchema: GetActionExecuteFormParamsSchema,
  handler: async (client: MetabaseClient, input: GetActionExecuteFormParams) => {
    const result = await client.get(`/api/action/${input.id}/execute`);
    return formatToolResponse(result);
  },
};
