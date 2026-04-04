import type { MetabaseClient } from '@src/client';
import {
  type ListSearchIndexedEntitiesParams,
  ListSearchIndexedEntitiesParamsSchema,
} from '@src/schemas/search';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing entities in the Metabase search index
 */
export const listSearchIndexedEntitiesDefinition: ToolDefinition<ListSearchIndexedEntitiesParams> =
  {
    name: 'list_search_indexed_entities',
    description: 'List entities currently in the Metabase search index',
    inputSchema: ListSearchIndexedEntitiesParamsSchema,
    handler: async (client: MetabaseClient, _input: ListSearchIndexedEntitiesParams) => {
      const result = await client.get('/api/search/indexed-entities');
      return formatToolResponse(result);
    },
  };
