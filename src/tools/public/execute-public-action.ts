import type { MetabaseClient } from '@src/client';
import { type ExecutePublicAction, ExecutePublicActionSchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const executePublicActionDefinition: ToolDefinition<ExecutePublicAction> = {
  name: 'execute_public_action',
  description: 'Execute a public action in Metabase',
  inputSchema: ExecutePublicActionSchema,
  handler: async (client: MetabaseClient, input: ExecutePublicAction) => {
    const result = await client.post(`/api/public/action/${input.uuid}/execute`, {
      parameters: input.parameters ?? {},
    });
    return formatToolResponse(result);
  },
};
