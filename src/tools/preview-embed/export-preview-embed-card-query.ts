import type { MetabaseClient } from '@src/client';
import {
  type ExportPreviewEmbedCardQuery,
  ExportPreviewEmbedCardQuerySchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const exportPreviewEmbedCardQueryDefinition: ToolDefinition<ExportPreviewEmbedCardQuery> = {
  name: 'export_preview_embed_card_query',
  description: 'Export results of a preview embedded card query in Metabase',
  inputSchema: ExportPreviewEmbedCardQuerySchema,
  handler: async (client: MetabaseClient, input: ExportPreviewEmbedCardQuery) => {
    const result = await client.get(
      `/api/preview_embed/card/${input.token}/query/${input.export_format}`,
    );
    return formatToolResponse(result);
  },
};
