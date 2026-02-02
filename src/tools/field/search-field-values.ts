import type { MetabaseClient } from '@src/client';
import { type SearchFieldValuesInput, SearchFieldValuesInputSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for searching field values
 */
export const searchFieldValuesDefinition: ToolDefinition<SearchFieldValuesInput> = {
  name: 'search_field_values',
  description: 'Search for specific values within a field in Metabase',
  inputSchema: SearchFieldValuesInputSchema,
  handler: async (client: MetabaseClient, input: SearchFieldValuesInput) => {
    const { id, value, limit } = input;
    const result = await client.get(`/api/field/${id}/search/${encodeURIComponent(value)}`, {
      limit,
    });
    return formatToolResponse(result);
  },
};
