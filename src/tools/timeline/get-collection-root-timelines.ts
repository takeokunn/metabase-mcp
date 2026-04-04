import type { MetabaseClient } from '@src/client';
import {
  type GetCollectionRootTimelinesParams,
  GetCollectionRootTimelinesParamsSchema,
} from '@src/schemas/timeline';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getCollectionRootTimelinesDefinition: ToolDefinition<GetCollectionRootTimelinesParams> =
  {
    name: 'get_collection_root_timelines',
    description: 'Get timelines in the root collection in Metabase',
    inputSchema: GetCollectionRootTimelinesParamsSchema,
    handler: async (client: MetabaseClient, input: GetCollectionRootTimelinesParams) => {
      const result = await client.get('/api/timeline/collection/root', {
        include: input.include,
        archived: input.archived,
      });
      return formatToolResponse(result);
    },
  };
