import type { MetabaseClient } from '@src/client';
import { type GetSegmentParams, GetSegmentParamsSchema } from '@src/schemas/segment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single segment by ID
 */
export const getSegmentDefinition: ToolDefinition<GetSegmentParams> = {
  name: 'get_segment',
  description: 'Get a single segment by ID from Metabase',
  inputSchema: GetSegmentParamsSchema,
  handler: async (client: MetabaseClient, input: GetSegmentParams) => {
    const segment = await client.get(`/api/segment/${input.id}`);
    return formatToolResponse(segment);
  },
};
