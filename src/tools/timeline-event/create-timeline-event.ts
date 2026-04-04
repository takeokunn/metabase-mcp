import type { MetabaseClient } from '@src/client';
import { type CreateTimelineEventInput, CreateTimelineEventInputSchema } from '@src/schemas/timeline';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createTimelineEventDefinition: ToolDefinition<CreateTimelineEventInput> = {
  name: 'create_timeline_event',
  description: 'Create a new timeline event in Metabase',
  inputSchema: CreateTimelineEventInputSchema,
  handler: async (client: MetabaseClient, input: CreateTimelineEventInput) => {
    const result = await client.post('/api/timeline-event', {
      name: input.name,
      timeline_id: input.timeline_id,
      timestamp: input.timestamp,
      description: input.description,
      icon: input.icon,
      time_matters: input.time_matters,
      timezone: input.timezone,
      archived: input.archived,
    });
    return formatToolResponse(result);
  },
};
