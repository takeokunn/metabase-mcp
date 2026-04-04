import type { MetabaseClient } from '@src/client';
import {
  type GetSegmentRevisionsParams,
  GetSegmentRevisionsParamsSchema,
} from '@src/schemas/segment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting revision history of a segment
 */
export const getSegmentRevisionsDefinition: ToolDefinition<GetSegmentRevisionsParams> = {
  name: 'get_segment_revisions',
  description: 'Get revision history of a segment from Metabase',
  inputSchema: GetSegmentRevisionsParamsSchema,
  handler: async (client: MetabaseClient, input: GetSegmentRevisionsParams) => {
    const revisions = await client.get('/api/revision', { entity: 'segment', id: input.id });
    return formatToolResponse(revisions);
  },
};
