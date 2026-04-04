import type { MetabaseClient } from '@src/client';
import { type ReinitSearchInput, ReinitSearchInputSchema } from '@src/schemas/search';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const reinitSearchDefinition: ToolDefinition<ReinitSearchInput> = {
  name: 'reinit_search',
  description: 'Re-initialize the search index in Metabase',
  inputSchema: ReinitSearchInputSchema,
  handler: async (client: MetabaseClient, _input: ReinitSearchInput) => {
    const result = await client.post('/api/search/re-init', {});
    return formatToolResponse(result);
  },
};
