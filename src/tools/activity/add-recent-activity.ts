import type { MetabaseClient } from '@src/client';
import { type AddRecentActivityInput, AddRecentActivityInputSchema } from '@src/schemas/activity';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const addRecentActivityDefinition: ToolDefinition<AddRecentActivityInput> = {
  name: 'add_recent_activity',
  description: 'Add an item to recent activity in Metabase',
  inputSchema: AddRecentActivityInputSchema,
  handler: async (client: MetabaseClient, input: AddRecentActivityInput) => {
    const result = await client.post('/api/activity/recents', { model_type: input.model_type, model_id: input.model_id });
    return formatToolResponse(result);
  },
};
