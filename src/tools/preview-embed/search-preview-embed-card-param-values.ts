import type { MetabaseClient } from '@src/client';
import {
  type SearchPreviewEmbedCardParamValues,
  SearchPreviewEmbedCardParamValuesSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const searchPreviewEmbedCardParamValuesDefinition: ToolDefinition<SearchPreviewEmbedCardParamValues> =
  {
    name: 'search_preview_embed_card_param_values',
    description: 'Search values for a parameter of a preview embedded card in Metabase',
    inputSchema: SearchPreviewEmbedCardParamValuesSchema,
    handler: async (client: MetabaseClient, input: SearchPreviewEmbedCardParamValues) => {
      const result = await client.get(
        `/api/preview_embed/card/${input.token}/params/${input.param_key}/search/${input.query}`,
      );
      return formatToolResponse(result);
    },
  };
