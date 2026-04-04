import type { MetabaseClient } from '@src/client';
import { type ExportEmbedCardQuery, ExportEmbedCardQuerySchema } from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const exportEmbedCardQueryDefinition: ToolDefinition<ExportEmbedCardQuery> = {
  name: 'export_embed_card_query',
  description: 'Export results of an embedded card query in Metabase',
  inputSchema: ExportEmbedCardQuerySchema,
  handler: async (client: MetabaseClient, input: ExportEmbedCardQuery) => {
    const result = await client.get(`/api/embed/card/${input.token}/query/${input.export_format}`);
    return formatToolResponse(result);
  },
};
