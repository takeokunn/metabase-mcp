import type { MetabaseClient } from '@src/client';
import { type GetDatabaseParams, GetDatabaseParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for triggering a database sync
 */
export const syncDatabaseDefinition: ToolDefinition<GetDatabaseParams> = {
  name: 'sync_database',
  description: 'Trigger a sync for a database in Metabase',
  inputSchema: GetDatabaseParamsSchema,
  handler: async (client: MetabaseClient, input: GetDatabaseParams) => {
    const result = await client.post(`/api/database/${input.id}/sync_schema`);
    return formatToolResponse(result ?? { success: true, message: 'Database sync triggered' });
  },
};
