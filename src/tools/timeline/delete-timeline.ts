import type { MetabaseClient } from '@src/client';
import { type DeleteTimelineParams, DeleteTimelineParamsSchema } from '@src/schemas/timeline';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deleteTimelineDefinition: ToolDefinition<DeleteTimelineParams> = {
  name: 'delete_timeline',
  description: 'Delete a timeline by ID in Metabase',
  inputSchema: DeleteTimelineParamsSchema,
  handler: async (client: MetabaseClient, input: DeleteTimelineParams) => {
    const result = await client.delete(`/api/timeline/${input.id}`);
    return formatToolResponse(result);
  },
};
