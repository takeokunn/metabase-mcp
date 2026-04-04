import type { MetabaseClient } from '@src/client';
import { type FieldDimensionParams, FieldDimensionParamsSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a dimension from a field in Metabase
 */
export const deleteFieldDimensionDefinition: ToolDefinition<FieldDimensionParams> = {
  name: 'delete_field_dimension',
  description: 'Delete a dimension (remapping) from a field in Metabase',
  inputSchema: FieldDimensionParamsSchema,
  handler: async (client: MetabaseClient, input: FieldDimensionParams) => {
    const result = await client.delete(`/api/field/${input.id}/dimension`);
    return formatToolResponse(result);
  },
};
