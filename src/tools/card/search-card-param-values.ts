import type { MetabaseClient } from '@src/client';
import {
  type SearchCardParamValuesParams,
  SearchCardParamValuesParamsSchema,
} from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for searching values for a card filter parameter in Metabase
 */
export const searchCardParamValuesDefinition: ToolDefinition<SearchCardParamValuesParams> = {
  name: 'search_card_param_values',
  description: 'Search possible values for a card (saved question) filter parameter in Metabase',
  inputSchema: SearchCardParamValuesParamsSchema,
  handler: async (client: MetabaseClient, input: SearchCardParamValuesParams) => {
    const result = await client.get(
      `/api/card/${input.id}/params/${encodeURIComponent(input.param_key)}/search/${encodeURIComponent(input.query)}`,
    );
    return formatToolResponse(result);
  },
};
