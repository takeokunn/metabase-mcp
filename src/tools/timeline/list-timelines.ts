import type { MetabaseClient } from '@src/client';
import { type ListTimelinesParams, ListTimelinesParamsSchema } from '@src/schemas/timeline';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listTimelinesDefinition: ToolDefinition<ListTimelinesParams> = {
  name: 'list_timelines',
  description: 'List all timelines in Metabase',
  inputSchema: ListTimelinesParamsSchema,
  handler: async (client: MetabaseClient, input: ListTimelinesParams) => {
    const result = await client.get('/api/timeline', {
      include: input.include,
      archived: input.archived,
    });
    return formatToolResponse(result);
  },
};
