import type { MetabaseClient } from '@src/client';
import {
  type SearchCardFieldValuesParams,
  SearchCardFieldValuesParamsSchema,
} from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for searching values for a field used in a card in Metabase
 */
export const searchCardFieldValuesDefinition: ToolDefinition<SearchCardFieldValuesParams> = {
  name: 'search_card_field_values',
  description: 'Search values for a field used in a card (saved question) in Metabase',
  inputSchema: SearchCardFieldValuesParamsSchema,
  handler: async (client: MetabaseClient, input: SearchCardFieldValuesParams) => {
    const result = await client.get(
      `/api/card/${input.id}/field/${input.field_id}/search/${encodeURIComponent(input.search_value)}`,
    );
    return formatToolResponse(result);
  },
};
