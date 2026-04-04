import type { MetabaseClient } from '@src/client';
import { type UpdateTimelineEventInput, UpdateTimelineEventInputSchema } from '@src/schemas/timeline';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateTimelineEventDefinition: ToolDefinition<UpdateTimelineEventInput> = {
  name: 'update_timeline_event',
  description: 'Update an existing timeline event in Metabase',
  inputSchema: UpdateTimelineEventInputSchema,
  handler: async (client: MetabaseClient, input: UpdateTimelineEventInput) => {
    const { id, ...body } = input;
    const result = await client.put(`/api/timeline-event/${id}`, body);
    return formatToolResponse(result);
  },
};
