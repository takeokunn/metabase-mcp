import type { MetabaseClient } from '@src/client';
import { type DeleteDatabaseSchemaParams, DeleteDatabaseSchemaParamsSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a schema from a database
 */
export const deleteDatabaseSchemaDefinition: ToolDefinition<DeleteDatabaseSchemaParams> = {
  name: 'delete_database_schema',
  description: 'Delete a schema from a database in Metabase',
  inputSchema: DeleteDatabaseSchemaParamsSchema,
  handler: async (client: MetabaseClient, input: DeleteDatabaseSchemaParams) => {
    const result = await client.delete(`/api/database/${input.id}/schema/${encodeURIComponent(input.schema)}`);
    return formatToolResponse(result ?? { success: true, message: 'Database schema deleted' });
  },
};
