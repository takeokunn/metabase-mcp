import type { MetabaseClient } from '@src/client';
import {
  type NotifyDatabaseSyncByNameInput,
  NotifyDatabaseSyncByNameInputSchema,
} from '@src/schemas/notify';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for notifying Metabase that a database has changed (triggers sync by name)
 */
export const notifyDatabaseSyncByNameDefinition: ToolDefinition<NotifyDatabaseSyncByNameInput> = {
  name: 'notify_database_sync_by_name',
  description:
    'Notify Metabase that a database has changed and trigger a sync by engine and database name. Used by external systems to signal schema or data changes without knowing the Metabase DB ID.',
  inputSchema: NotifyDatabaseSyncByNameInputSchema,
  handler: async (client: MetabaseClient, input: NotifyDatabaseSyncByNameInput) => {
    const result = await client.post('/api/notify/db/attached_datawarehouse', {
      engine: input.engine,
      database_name: input.database_name,
      table_name: input.table_name,
      synchronous: input.synchronous,
    });
    return formatToolResponse(result);
  },
};
