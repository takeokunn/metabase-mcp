import type { MetabaseClient } from '@src/client';
import { type GetCollectionParams, GetCollectionParamsSchema } from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single collection by ID
 */
export const getCollectionDefinition: ToolDefinition<GetCollectionParams> = {
  name: 'get_collection',
  description: 'Get a single collection by ID from Metabase (supports "root" for root collection)',
  inputSchema: GetCollectionParamsSchema,
  handler: async (client: MetabaseClient, input: GetCollectionParams) => {
    const collection = await client.get(`/api/collection/${input.id}`);
    return formatToolResponse(collection);
  },
};
