import type { MetabaseClient } from '@src/client';
import { type GetDatabaseSyncableSchemasParams, GetDatabaseSyncableSchemasParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getDatabaseSyncableSchemasDefinition: ToolDefinition<GetDatabaseSyncableSchemasParams> = {
  name: 'get_database_syncable_schemas',
  description: 'Get syncable schemas for a database in Metabase',
  inputSchema: GetDatabaseSyncableSchemasParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseSyncableSchemasParams) => {
    const result = await client.get(`/api/database/${input.id}/syncable_schemas`);
    return formatToolResponse(result);
  },
};
