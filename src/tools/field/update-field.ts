import type { MetabaseClient } from '@src/client';
import { type UpdateFieldInput, UpdateFieldInputSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a field's metadata in Metabase
 */
export const updateFieldDefinition: ToolDefinition<UpdateFieldInput> = {
  name: 'update_field',
  description:
    'Update field metadata including display name, description, semantic type, and visibility settings',
  inputSchema: UpdateFieldInputSchema,
  handler: async (client: MetabaseClient, input: UpdateFieldInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/field/${id}`, updateData);
    return formatToolResponse(result);
  },
};
