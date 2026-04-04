import type { MetabaseClient } from '@src/client';
import { type ExportPublicCardQuery, ExportPublicCardQuerySchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const exportPublicCardQueryDefinition: ToolDefinition<ExportPublicCardQuery> = {
  name: 'export_public_card_query',
  description: 'Export results of a public card query in Metabase',
  inputSchema: ExportPublicCardQuerySchema,
  handler: async (client: MetabaseClient, input: ExportPublicCardQuery) => {
    const result = await client.get(
      `/api/public/card/${input.uuid}/query/${input.export_format}`,
    );
    return formatToolResponse(result);
  },
};
