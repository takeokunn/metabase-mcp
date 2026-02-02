import type { MetabaseClient } from '@src/client';
import { type GetFieldValuesInput, GetFieldValuesInputSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting the cached values of a field
 */
export const getFieldValuesDefinition: ToolDefinition<GetFieldValuesInput> = {
  name: 'get_field_values',
  description: 'Get the cached distinct values for a field from Metabase',
  inputSchema: GetFieldValuesInputSchema,
  handler: async (client: MetabaseClient, input: GetFieldValuesInput) => {
    const result = await client.get(`/api/field/${input.id}/values`);
    return formatToolResponse(result);
  },
};
