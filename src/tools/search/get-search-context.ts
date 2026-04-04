import type { MetabaseClient } from '@src/client';
import {
  type GetSearchContextParams,
  GetSearchContextParamsSchema,
} from '@src/schemas/search';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting search context and filter options from Metabase
 */
export const getSearchContextDefinition: ToolDefinition<GetSearchContextParams> = {
  name: 'get_search_context',
  description: 'Get search context and available filter options from Metabase',
  inputSchema: GetSearchContextParamsSchema,
  handler: async (client: MetabaseClient, _input: GetSearchContextParams) => {
    const result = await client.get('/api/search/context');
    return formatToolResponse(result);
  },
};
