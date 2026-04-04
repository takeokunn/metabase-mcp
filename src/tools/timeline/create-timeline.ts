import type { MetabaseClient } from '@src/client';
import { type CreateTimelineInput, CreateTimelineInputSchema } from '@src/schemas/timeline';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createTimelineDefinition: ToolDefinition<CreateTimelineInput> = {
  name: 'create_timeline',
  description: 'Create a new timeline in Metabase',
  inputSchema: CreateTimelineInputSchema,
  handler: async (client: MetabaseClient, input: CreateTimelineInput) => {
    const result = await client.post('/api/timeline', {
      name: input.name,
      collection_id: input.collection_id,
      description: input.description,
      icon: input.icon,
      archived: input.archived,
    });
    return formatToolResponse(result);
  },
};
