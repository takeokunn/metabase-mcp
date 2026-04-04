import type { MetabaseClient } from '@src/client';
import { type UpdateActionInput, UpdateActionInputSchema } from '@src/schemas/action';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateActionDefinition: ToolDefinition<UpdateActionInput> = {
  name: 'update_action',
  description: 'Update an existing action in Metabase',
  inputSchema: UpdateActionInputSchema,
  handler: async (client: MetabaseClient, input: UpdateActionInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/action/${id}`, updateData);
    return formatToolResponse(result);
  },
};
