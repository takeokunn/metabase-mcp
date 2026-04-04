import type { MetabaseClient } from '@src/client';
import { type ExportCardQueryParams, ExportCardQueryParamsSchema } from '@src/schemas/card';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for exporting a card query result in a specified format in Metabase
 */
export const exportCardQueryDefinition: ToolDefinition<ExportCardQueryParams> = {
  name: 'export_card_query',
  description:
    'Export a card (saved question) query result in a specified format (csv, json, xlsx, pdf) in Metabase',
  inputSchema: ExportCardQueryParamsSchema,
  handler: async (client: MetabaseClient, input: ExportCardQueryParams) => {
    const result = await client.post(`/api/card/${input.id}/query/${input.export_format}`, {});
    return formatToolResponse(result);
  },
};
