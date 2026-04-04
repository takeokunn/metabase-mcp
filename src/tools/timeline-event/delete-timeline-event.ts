import type { MetabaseClient } from '@src/client';
import {
  type DeleteTimelineEventParams,
  DeleteTimelineEventParamsSchema,
} from '@src/schemas/timeline';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deleteTimelineEventDefinition: ToolDefinition<DeleteTimelineEventParams> = {
  name: 'delete_timeline_event',
  description: 'Delete a timeline event by ID in Metabase',
  inputSchema: DeleteTimelineEventParamsSchema,
  handler: async (client: MetabaseClient, input: DeleteTimelineEventParams) => {
    const result = await client.delete(`/api/timeline-event/${input.id}`);
    return formatToolResponse(result);
  },
};
