import type { MetabaseClient } from '@src/client';
import {
  type NotifyNewDatabaseTableInput,
  NotifyNewDatabaseTableInputSchema,
} from '@src/schemas/notify';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const notifyNewDatabaseTableDefinition: ToolDefinition<NotifyNewDatabaseTableInput> = {
  name: 'notify_new_database_table',
  description: 'Notify Metabase of a new table in a database',
  inputSchema: NotifyNewDatabaseTableInputSchema,
  handler: async (client: MetabaseClient, input: NotifyNewDatabaseTableInput) => {
    const result = await client.post(`/api/notify/db/${input.id}/new-table`, {
      table_id: input.table_id,
    });
    return formatToolResponse(result);
  },
};
