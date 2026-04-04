import type { MetabaseClient } from '@src/client';
import { type GetTimelineParams, GetTimelineParamsSchema } from '@src/schemas/timeline';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getTimelineDefinition: ToolDefinition<GetTimelineParams> = {
  name: 'get_timeline',
  description: 'Get a timeline by ID in Metabase',
  inputSchema: GetTimelineParamsSchema,
  handler: async (client: MetabaseClient, input: GetTimelineParams) => {
    const result = await client.get(`/api/timeline/${input.id}`, {
      include: input.include,
      start: input.start,
      end: input.end,
    });
    return formatToolResponse(result);
  },
};
