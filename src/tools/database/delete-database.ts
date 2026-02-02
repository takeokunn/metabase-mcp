import type { MetabaseClient } from '@src/client';
import { type DeleteDatabaseInput, DeleteDatabaseInputSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a database connection from Metabase
 */
export const deleteDatabaseDefinition: ToolDefinition<DeleteDatabaseInput> = {
  name: 'delete_database',
  description: 'Delete a database connection from Metabase',
  inputSchema: DeleteDatabaseInputSchema,
  handler: async (client: MetabaseClient, input: DeleteDatabaseInput) => {
    const result = await client.delete(`/api/database/${input.id}`);
    return formatToolResponse(result);
  },
};
