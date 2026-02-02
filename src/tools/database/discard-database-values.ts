import type { MetabaseClient } from '@src/client';
import { type DatabaseIdInput, DatabaseIdInputSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for discarding cached field values for a database in Metabase
 */
export const discardDatabaseValuesDefinition: ToolDefinition<DatabaseIdInput> = {
  name: 'discard_database_values',
  description: 'Discard cached field values for a database in Metabase',
  inputSchema: DatabaseIdInputSchema,
  handler: async (client: MetabaseClient, input: DatabaseIdInput) => {
    const result = await client.post(`/api/database/${input.id}/discard_values`);
    return formatToolResponse(result);
  },
};
