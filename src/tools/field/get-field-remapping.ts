import type { MetabaseClient } from '@src/client';
import { type GetFieldRemappingInput, GetFieldRemappingInputSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getFieldRemappingDefinition: ToolDefinition<GetFieldRemappingInput> = {
  name: 'get_field_remapping',
  description: 'Get remapping between two fields in Metabase',
  inputSchema: GetFieldRemappingInputSchema,
  handler: async (client: MetabaseClient, input: GetFieldRemappingInput) => {
    const result = await client.get(`/api/field/${input.id}/remapping/${input.remapped_id}`);
    return formatToolResponse(result);
  },
};
