import type { MetabaseClient } from '@src/client';
import { type UpdateTableInput, UpdateTableInputSchema } from '@src/schemas/table';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a table in Metabase
 */
export const updateTableDefinition: ToolDefinition<UpdateTableInput> = {
  name: 'update_table',
  description: 'Update a table in Metabase (display name, description, visibility)',
  inputSchema: UpdateTableInputSchema,
  handler: async (client: MetabaseClient, input: UpdateTableInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/table/${id}`, updateData);
    return formatToolResponse(result);
  },
};
