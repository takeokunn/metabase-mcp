import type { MetabaseClient } from '@src/client';
import {
  type GetRootCollectionItemsParams,
  GetRootCollectionItemsParamsSchema,
} from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting items within the root collection
 */
export const getRootCollectionItemsDefinition: ToolDefinition<GetRootCollectionItemsParams> = {
  name: 'get_root_collection_items',
  description: 'Get items (cards, dashboards, etc.) within the root collection in Metabase',
  inputSchema: GetRootCollectionItemsParamsSchema,
  handler: async (client: MetabaseClient, input: GetRootCollectionItemsParams) => {
    const params: Record<string, string | number | boolean | undefined> = {
      limit: input.limit,
      offset: input.offset,
    };

    if (input.models && input.models.length > 0) {
      params.models = input.models.join(',');
    }

    const result = await client.get('/api/collection/root/items', params);
    return formatToolResponse(result);
  },
};
