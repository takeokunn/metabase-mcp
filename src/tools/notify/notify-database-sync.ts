import type { MetabaseClient } from '@src/client';
import {
  type NotifyDatabaseSyncInput,
  NotifyDatabaseSyncInputSchema,
} from '@src/schemas/notify';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for notifying Metabase that a database has changed (triggers sync by ID)
 */
export const notifyDatabaseSyncDefinition: ToolDefinition<NotifyDatabaseSyncInput> = {
  name: 'notify_database_sync',
  description:
    'Notify Metabase that a database has changed and trigger a sync by database ID. Used by external systems to signal that a DB schema or data has changed.',
  inputSchema: NotifyDatabaseSyncInputSchema,
  handler: async (client: MetabaseClient, input: NotifyDatabaseSyncInput) => {
    const result = await client.post(`/api/notify/db/${input.id}`, {
      table_name: input.table_name,
      synchronous: input.synchronous,
    });
    return formatToolResponse(result);
  },
};
