import type { MetabaseClient } from '@src/client';
import {
  type CreateFieldDimensionInput,
  CreateFieldDimensionInputSchema,
} from '@src/schemas/field';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a dimension for a field in Metabase
 */
export const createFieldDimensionDefinition: ToolDefinition<CreateFieldDimensionInput> = {
  name: 'create_field_dimension',
  description: 'Create a dimension (remapping) for a field in Metabase',
  inputSchema: CreateFieldDimensionInputSchema,
  handler: async (client: MetabaseClient, input: CreateFieldDimensionInput) => {
    const result = await client.post(`/api/field/${input.id}/dimension`, {
      type: input.type,
      name: input.name,
      human_readable_field_id: input.human_readable_field_id,
    });
    return formatToolResponse(result);
  },
};
