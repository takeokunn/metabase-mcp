import type { MetabaseClient } from '@src/client';
import { type ExecuteActionInput, ExecuteActionInputSchema } from '@src/schemas/action';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const executeActionDefinition: ToolDefinition<ExecuteActionInput> = {
  name: 'execute_action',
  description: 'Execute an action with parameters in Metabase',
  inputSchema: ExecuteActionInputSchema,
  handler: async (client: MetabaseClient, input: ExecuteActionInput) => {
    const result = await client.post(`/api/action/${input.id}/execute`, {
      parameters: input.parameters,
    });
    return formatToolResponse(result);
  },
};
