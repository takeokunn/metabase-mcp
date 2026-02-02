import type { MetabaseClient } from '@src/client';
import { type GetFieldInput, GetFieldInputSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a single field by ID
 */
export const getFieldDefinition: ToolDefinition<GetFieldInput> = {
  name: 'get_field',
  description: 'Get details of a specific field by ID from Metabase',
  inputSchema: GetFieldInputSchema,
  handler: async (client: MetabaseClient, input: GetFieldInput) => {
    const result = await client.get(`/api/field/${input.id}`);
    return formatToolResponse(result);
  },
};
