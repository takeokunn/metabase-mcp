import type { MetabaseClient } from '@src/client';
import {
  type ExportPreviewEmbedDashcardQuery,
  ExportPreviewEmbedDashcardQuerySchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const exportPreviewEmbedDashcardQueryDefinition: ToolDefinition<ExportPreviewEmbedDashcardQuery> =
  {
    name: 'export_preview_embed_dashcard_query',
    description: 'Export results of a preview embedded dashcard query in Metabase',
    inputSchema: ExportPreviewEmbedDashcardQuerySchema,
    handler: async (client: MetabaseClient, input: ExportPreviewEmbedDashcardQuery) => {
      const result = await client.get(
        `/api/preview_embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query/${input.export_format}`,
      );
      return formatToolResponse(result);
    },
  };
