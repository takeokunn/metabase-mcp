import type { MetabaseClient } from '@src/client';
import { type UpdateTimelineInput, UpdateTimelineInputSchema } from '@src/schemas/timeline';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateTimelineDefinition: ToolDefinition<UpdateTimelineInput> = {
  name: 'update_timeline',
  description: 'Update an existing timeline in Metabase',
  inputSchema: UpdateTimelineInputSchema,
  handler: async (client: MetabaseClient, input: UpdateTimelineInput) => {
    const { id, ...body } = input;
    const result = await client.put(`/api/timeline/${id}`, body);
    return formatToolResponse(result);
  },
};
