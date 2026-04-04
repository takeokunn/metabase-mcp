import type { MetabaseClient } from '@src/client';
import {
  type SearchPublicCardParamValues,
  SearchPublicCardParamValuesSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const searchPublicCardParamValuesDefinition: ToolDefinition<SearchPublicCardParamValues> = {
  name: 'search_public_card_param_values',
  description: 'Search values for a parameter of a public card in Metabase',
  inputSchema: SearchPublicCardParamValuesSchema,
  handler: async (client: MetabaseClient, input: SearchPublicCardParamValues) => {
    const result = await client.get(
      `/api/public/card/${input.uuid}/params/${input.param_key}/search/${input.query}`,
    );
    return formatToolResponse(result);
  },
};
