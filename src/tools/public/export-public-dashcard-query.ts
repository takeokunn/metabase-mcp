import type { MetabaseClient } from '@src/client';
import { type ExportPublicDashcardQuery, ExportPublicDashcardQuerySchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const exportPublicDashcardQueryDefinition: ToolDefinition<ExportPublicDashcardQuery> = {
  name: 'export_public_dashcard_query',
  description: 'Export results of a public dashcard query in Metabase',
  inputSchema: ExportPublicDashcardQuerySchema,
  handler: async (client: MetabaseClient, input: ExportPublicDashcardQuery) => {
    const result = await client.post(
      `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/${input.export_format}`,
      {},
    );
    return formatToolResponse(result);
  },
};
