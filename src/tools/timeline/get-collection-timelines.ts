import type { MetabaseClient } from '@src/client';
import {
  type GetCollectionTimelinesParams,
  GetCollectionTimelinesParamsSchema,
} from '@src/schemas/timeline';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getCollectionTimelinesDefinition: ToolDefinition<GetCollectionTimelinesParams> = {
  name: 'get_collection_timelines',
  description: 'Get timelines for a specific collection in Metabase',
  inputSchema: GetCollectionTimelinesParamsSchema,
  handler: async (client: MetabaseClient, input: GetCollectionTimelinesParams) => {
    const result = await client.get(`/api/timeline/collection/${input.id}`, {
      include: input.include,
      archived: input.archived,
    });
    return formatToolResponse(result);
  },
};
