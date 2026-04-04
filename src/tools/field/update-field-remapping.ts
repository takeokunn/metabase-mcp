import type { MetabaseClient } from '@src/client';
import { type UpdateFieldRemappingInput, UpdateFieldRemappingInputSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating remapping values for a field in Metabase
 */
export const updateFieldRemappingDefinition: ToolDefinition<UpdateFieldRemappingInput> = {
  name: 'update_field_remapping',
  description: 'Update remapping values for a field in Metabase',
  inputSchema: UpdateFieldRemappingInputSchema,
  handler: async (client: MetabaseClient, input: UpdateFieldRemappingInput) => {
    const result = await client.post(`/api/field/${input.id}/values/remapping`, input.values);
    return formatToolResponse(result);
  },
};
