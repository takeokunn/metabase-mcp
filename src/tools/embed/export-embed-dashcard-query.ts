import type { MetabaseClient } from '@src/client';
import { type ExportEmbedDashcardQuery, ExportEmbedDashcardQuerySchema } from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const exportEmbedDashcardQueryDefinition: ToolDefinition<ExportEmbedDashcardQuery> = {
  name: 'export_embed_dashcard_query',
  description: 'Export results of an embedded dashcard query in Metabase',
  inputSchema: ExportEmbedDashcardQuerySchema,
  handler: async (client: MetabaseClient, input: ExportEmbedDashcardQuery) => {
    const result = await client.get(
      `/api/embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query/${input.export_format}`,
    );
    return formatToolResponse(result);
  },
};
