import type { MetabaseClient } from '@src/client';
import {
  type PreviewEmbedCardParams,
  PreviewEmbedCardParamsSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const previewEmbedCardDefinition: ToolDefinition<PreviewEmbedCardParams> = {
  name: 'preview_embed_card',
  description: 'Preview an embedded card by token from Metabase (admin only)',
  inputSchema: PreviewEmbedCardParamsSchema,
  handler: async (client: MetabaseClient, input: PreviewEmbedCardParams) => {
    const result = await client.get(`/api/preview_embed/card/${input.token}`);
    return formatToolResponse(result);
  },
};
