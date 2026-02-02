import type { MetabaseClient } from '@src/client';
import { type UpdateDatabaseInput, UpdateDatabaseInputSchema } from '@src/schemas/database';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a database connection configuration in Metabase
 */
export const updateDatabaseDefinition: ToolDefinition<UpdateDatabaseInput> = {
  name: 'update_database',
  description: 'Update an existing database connection configuration in Metabase',
  inputSchema: UpdateDatabaseInputSchema,
  handler: async (client: MetabaseClient, input: UpdateDatabaseInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/database/${id}`, updateData);
    return formatToolResponse(result);
  },
};
