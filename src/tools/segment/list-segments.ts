import type { MetabaseClient } from '@src/client';
import { type ListSegmentsParams, ListSegmentsParamsSchema } from '@src/schemas/segment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all segments in Metabase
 */
export const listSegmentsDefinition: ToolDefinition<ListSegmentsParams> = {
  name: 'list_segments',
  description: 'Get list of all segments in Metabase',
  inputSchema: ListSegmentsParamsSchema,
  handler: async (client: MetabaseClient, _input: ListSegmentsParams) => {
    const segments = await client.get('/api/segment');
    return formatToolResponse(segments);
  },
};
