import type { MetabaseClient } from '@src/client';
import { type DeleteActionParams, DeleteActionParamsSchema } from '@src/schemas/action';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deleteActionDefinition: ToolDefinition<DeleteActionParams> = {
  name: 'delete_action',
  description: 'Delete an action from Metabase',
  inputSchema: DeleteActionParamsSchema,
  handler: async (client: MetabaseClient, input: DeleteActionParams) => {
    const result = await client.delete(`/api/action/${input.id}`);
    return formatToolResponse(result);
  },
};
