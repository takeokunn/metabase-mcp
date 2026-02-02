import type { MetabaseClient } from '@src/client';
import { type GetTableMetadataParams, GetTableMetadataParamsSchema } from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting table metadata including fields
 */
export const getTableMetadataDefinition: ToolDefinition<GetTableMetadataParams> = {
  name: 'get_table_metadata',
  description: 'Get table metadata including fields from Metabase',
  inputSchema: GetTableMetadataParamsSchema,
  handler: async (client: MetabaseClient, input: GetTableMetadataParams) => {
    const { id, include_hidden_fields } = input;
    const params = include_hidden_fields !== undefined ? { include_hidden_fields } : undefined;
    const metadata = await client.get(`/api/table/${id}/query_metadata`, params);
    return formatToolResponse(metadata);
  },
};
