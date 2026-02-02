import type { MetabaseClient } from '@src/client';
import { type ListCollectionsParams, ListCollectionsParamsSchema } from '@src/schemas/collection';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing all collections in Metabase
 */
export const listCollectionsDefinition: ToolDefinition<ListCollectionsParams> = {
  name: 'list_collections',
  description: 'Get list of all collections (folders) in Metabase',
  inputSchema: ListCollectionsParamsSchema,
  handler: async (client: MetabaseClient, input: ListCollectionsParams) => {
    const collections = await client.get('/api/collection', {
      namespace: input.namespace,
    });
    return formatToolResponse(collections);
  },
};
