import type { MetabaseClient } from '@src/client';
import { type CreateActionInput, CreateActionInputSchema } from '@src/schemas/action';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createActionDefinition: ToolDefinition<CreateActionInput> = {
  name: 'create_action',
  description: 'Create a new action in Metabase',
  inputSchema: CreateActionInputSchema,
  handler: async (client: MetabaseClient, input: CreateActionInput) => {
    const result = await client.post('/api/action', input);
    return formatToolResponse(result);
  },
};
