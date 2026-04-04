import type { MetabaseClient } from '@src/client';
import { type FieldDimensionParams, FieldDimensionParamsSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting remapping values for a field in Metabase
 */
export const listFieldRemappingDefinition: ToolDefinition<FieldDimensionParams> = {
  name: 'list_field_remapping',
  description: 'Get remapping values for a field in Metabase',
  inputSchema: FieldDimensionParamsSchema,
  handler: async (client: MetabaseClient, input: FieldDimensionParams) => {
    const result = await client.get(`/api/field/${input.id}/values/remapping`);
    return formatToolResponse(result);
  },
};
