import type { MetabaseClient } from '@src/client';
import { type GetFieldRelatedInput, GetFieldRelatedInputSchema } from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting related entities for a field
 */
export const getFieldRelatedDefinition: ToolDefinition<GetFieldRelatedInput> = {
  name: 'get_field_related',
  description: 'Get related entities (tables, fields) for a field in Metabase',
  inputSchema: GetFieldRelatedInputSchema,
  handler: async (client: MetabaseClient, input: GetFieldRelatedInput) => {
    const result = await client.get(`/api/field/${input.id}/related`);
    return formatToolResponse(result);
  },
};
