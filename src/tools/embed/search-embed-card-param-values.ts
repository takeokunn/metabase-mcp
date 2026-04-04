import type { MetabaseClient } from '@src/client';
import {
  type SearchEmbedCardParamValues,
  SearchEmbedCardParamValuesSchema,
} from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const searchEmbedCardParamValuesDefinition: ToolDefinition<SearchEmbedCardParamValues> = {
  name: 'search_embed_card_param_values',
  description: 'Search values for a parameter of an embedded card in Metabase',
  inputSchema: SearchEmbedCardParamValuesSchema,
  handler: async (client: MetabaseClient, input: SearchEmbedCardParamValues) => {
    const result = await client.get(
      `/api/embed/card/${input.token}/params/${input.param_key}/search/${input.query}`,
    );
    return formatToolResponse(result);
  },
};
