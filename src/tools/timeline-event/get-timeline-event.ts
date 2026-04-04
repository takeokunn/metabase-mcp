import type { MetabaseClient } from '@src/client';
import { type GetTimelineEventParams, GetTimelineEventParamsSchema } from '@src/schemas/timeline';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getTimelineEventDefinition: ToolDefinition<GetTimelineEventParams> = {
  name: 'get_timeline_event',
  description: 'Get a timeline event by ID in Metabase',
  inputSchema: GetTimelineEventParamsSchema,
  handler: async (client: MetabaseClient, input: GetTimelineEventParams) => {
    const result = await client.get(`/api/timeline-event/${input.id}`);
    return formatToolResponse(result);
  },
};
