import type { MetabaseClient } from '@src/client';
import {
  type ExportPublicDashcardQueryFormat,
  ExportPublicDashcardQueryFormatSchema,
} from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const exportPublicDashcardQueryFormatDefinition: ToolDefinition<ExportPublicDashcardQueryFormat> =
  {
    name: 'export_public_dashcard_query_format',
    description: 'Export results of a public dashboard card query in a specific format in Metabase',
    inputSchema: ExportPublicDashcardQueryFormatSchema,
    handler: async (client: MetabaseClient, input: ExportPublicDashcardQueryFormat) => {
      const result = await client.post(
        `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/${input.export_format}`,
        {},
      );
      return formatToolResponse(result);
    },
  };
