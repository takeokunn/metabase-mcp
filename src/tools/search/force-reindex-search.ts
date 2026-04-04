import type { MetabaseClient } from '@src/client';
import { type ForceReindexSearchInput, ForceReindexSearchInputSchema } from '@src/schemas/search';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const forceReindexSearchDefinition: ToolDefinition<ForceReindexSearchInput> = {
  name: 'force_reindex_search',
  description: 'Force a full reindex of the search index in Metabase',
  inputSchema: ForceReindexSearchInputSchema,
  handler: async (client: MetabaseClient, _input: ForceReindexSearchInput) => {
    const result = await client.post('/api/search/force-reindex', {});
    return formatToolResponse(result);
  },
};
