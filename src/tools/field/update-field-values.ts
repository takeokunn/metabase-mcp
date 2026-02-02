import type { MetabaseClient } from '@src/client';
import { type UpdateFieldValuesInput, UpdateFieldValuesInputSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating the human-readable values of a field
 */
export const updateFieldValuesDefinition: ToolDefinition<UpdateFieldValuesInput> = {
  name: 'update_field_values',
  description: 'Update the human-readable values for a field in Metabase',
  inputSchema: UpdateFieldValuesInputSchema,
  handler: async (client: MetabaseClient, input: UpdateFieldValuesInput) => {
    const { id, values } = input;
    const result = await client.post(`/api/field/${id}/values`, { values });
    return formatToolResponse(result);
  },
};
