import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';
import { z } from 'zod';

const GetTrashCollectionItemsParamsSchema = z.object({});
type GetTrashCollectionItemsParams = z.infer<typeof GetTrashCollectionItemsParamsSchema>;

/**
 * Tool definition for getting items in the trash collection
 */
export const getTrashCollectionItemsDefinition: ToolDefinition<GetTrashCollectionItemsParams> = {
  name: 'get_trash_collection_items',
  description: 'Get items in the trash collection in Metabase',
  inputSchema: GetTrashCollectionItemsParamsSchema,
  handler: async (client: MetabaseClient, _input: GetTrashCollectionItemsParams) => {
    const result = await client.get('/api/collection/trash/items');
    return formatToolResponse(result);
  },
};
