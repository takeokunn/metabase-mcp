import type { MetabaseClient } from '@src/client';
import { type GetDatabaseParams, GetDatabaseParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting database metadata including tables and fields
 */
export const getDatabaseMetadataDefinition: ToolDefinition<GetDatabaseParams> = {
  name: 'get_database_metadata',
  description: 'Get database metadata including tables and fields from Metabase',
  inputSchema: GetDatabaseParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseParams) => {
    const metadata = await client.get(`/api/database/${input.id}/metadata`);
    return formatToolResponse(metadata);
  },
};
