import type { MetabaseClient } from '@src/client';
import { type ListActionsParams, ListActionsParamsSchema } from '@src/schemas/action';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listActionsDefinition: ToolDefinition<ListActionsParams> = {
  name: 'list_actions',
  description: 'Get list of actions in Metabase, optionally filtered by model ID',
  inputSchema: ListActionsParamsSchema,
  handler: async (client: MetabaseClient, input: ListActionsParams) => {
    const params = input.model_id ? { 'model-id': input.model_id } : undefined;
    const result = await client.get('/api/action', params);
    return formatToolResponse(result);
  },
};
