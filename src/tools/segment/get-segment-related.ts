import type { MetabaseClient } from '@src/client';
import { type GetSegmentRelatedInput, GetSegmentRelatedInputSchema } from '@src/schemas/segment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getSegmentRelatedDefinition: ToolDefinition<GetSegmentRelatedInput> = {
  name: 'get_segment_related',
  description: 'Get related items for a segment in Metabase',
  inputSchema: GetSegmentRelatedInputSchema,
  handler: async (client: MetabaseClient, input: GetSegmentRelatedInput) => {
    const result = await client.get(`/api/segment/${input.id}/related`);
    return formatToolResponse(result);
  },
};
