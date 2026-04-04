import type { MetabaseClient } from '@src/client';
import {
  type GetPreviewEmbedCardParamValues,
  GetPreviewEmbedCardParamValuesSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPreviewEmbedCardParamValuesDefinition: ToolDefinition<GetPreviewEmbedCardParamValues> =
  {
    name: 'get_preview_embed_card_param_values',
    description: 'Get values for a parameter of a preview embedded card in Metabase',
    inputSchema: GetPreviewEmbedCardParamValuesSchema,
    handler: async (client: MetabaseClient, input: GetPreviewEmbedCardParamValues) => {
      const result = await client.get(
        `/api/preview_embed/card/${input.token}/params/${input.param_key}/values`,
      );
      return formatToolResponse(result);
    },
  };
