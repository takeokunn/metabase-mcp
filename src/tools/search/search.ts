import type { MetabaseClient } from '@src/client';
import { type SearchParams, SearchParamsSchema } from '@src/schemas/search';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for searching Metabase content
 */
export const searchDefinition: ToolDefinition<SearchParams> = {
  name: 'search',
  description:
    'Search for cards, dashboards, collections, tables, databases, actions, and indexed entities in Metabase',
  inputSchema: SearchParamsSchema,
  handler: async (client: MetabaseClient, input: SearchParams) => {
    const params: Record<string, string | number | boolean | undefined> = {
      q: input.q,
    };

    if (input.models && input.models.length > 0) {
      params.models = input.models.join(',');
    }
    if (input.limit !== undefined) {
      params.limit = input.limit;
    }
    if (input.offset !== undefined) {
      params.offset = input.offset;
    }
    if (input.table_db_id !== undefined) {
      params.table_db_id = input.table_db_id;
    }
    if (input.collection_id !== undefined) {
      params.collection_id = input.collection_id;
    }

    const results = await client.get('/api/search', params);
    return formatToolResponse(results);
  },
};
