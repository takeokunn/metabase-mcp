import type { MetabaseClient } from '@src/client';
import { type SyncDatabaseSchemaParams, SyncDatabaseSchemaParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for syncing the schema of a database (schema only, not a full sync)
 */
export const syncDatabaseSchemaDefinition: ToolDefinition<SyncDatabaseSchemaParams> = {
  name: 'sync_database_schema',
  description: 'Sync the schema of a database in Metabase (schema only, not a full resync)',
  inputSchema: SyncDatabaseSchemaParamsSchema,
  handler: async (client: MetabaseClient, input: SyncDatabaseSchemaParams) => {
    const result = await client.post(`/api/database/${input.id}/sync_schema`);
    return formatToolResponse(result ?? { success: true, message: 'Database schema sync triggered' });
  },
};
