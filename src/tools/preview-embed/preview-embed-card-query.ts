import type { MetabaseClient } from '@src/client';
import {
  type PreviewEmbedCardQueryParams,
  PreviewEmbedCardQueryParamsSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const previewEmbedCardQueryDefinition: ToolDefinition<PreviewEmbedCardQueryParams> = {
  name: 'preview_embed_card_query',
  description: 'Preview query results for an embedded card by token from Metabase (admin only)',
  inputSchema: PreviewEmbedCardQueryParamsSchema,
  handler: async (client: MetabaseClient, input: PreviewEmbedCardQueryParams) => {
    const result = await client.get(`/api/preview_embed/card/${input.token}/query`);
    return formatToolResponse(result);
  },
};
