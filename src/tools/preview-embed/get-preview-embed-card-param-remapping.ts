import type { MetabaseClient } from '@src/client';
import {
  type GetPreviewEmbedCardParamRemapping,
  GetPreviewEmbedCardParamRemappingSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPreviewEmbedCardParamRemappingDefinition: ToolDefinition<GetPreviewEmbedCardParamRemapping> =
  {
    name: 'get_preview_embed_card_param_remapping',
    description: 'Get remapping for a parameter of a preview embedded card in Metabase',
    inputSchema: GetPreviewEmbedCardParamRemappingSchema,
    handler: async (client: MetabaseClient, input: GetPreviewEmbedCardParamRemapping) => {
      const result = await client.get(
        `/api/preview_embed/card/${input.token}/params/${input.param_key}/remapping`,
      );
      return formatToolResponse(result);
    },
  };
