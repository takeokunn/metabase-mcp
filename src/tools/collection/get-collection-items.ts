import type { MetabaseClient } from '@src/client';
import {
  type GetCollectionItemsParams,
  GetCollectionItemsParamsSchema,
} from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting items within a collection
 */
export const getCollectionItemsDefinition: ToolDefinition<GetCollectionItemsParams> = {
  name: 'get_collection_items',
  description:
    'Get items (cards, dashboards, etc.) within a collection (supports "root" for root collection)',
  inputSchema: GetCollectionItemsParamsSchema,
  handler: async (client: MetabaseClient, input: GetCollectionItemsParams) => {
    const params: Record<string, string | number | boolean | undefined> = {
      limit: input.limit,
      offset: input.offset,
    };

    if (input.models && input.models.length > 0) {
      params.models = input.models.join(',');
    }

    const items = await client.get(`/api/collection/${input.id}/items`, params);
    return formatToolResponse(items);
  },
};
