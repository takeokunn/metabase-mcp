import type { MetabaseClient } from '@src/client';
import { type UpdateSegmentInput, UpdateSegmentInputSchema } from '@src/schemas/segment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating an existing segment in Metabase
 */
export const updateSegmentDefinition: ToolDefinition<UpdateSegmentInput> = {
  name: 'update_segment',
  description: 'Update an existing segment in Metabase',
  inputSchema: UpdateSegmentInputSchema,
  handler: async (client: MetabaseClient, input: UpdateSegmentInput) => {
    const { id, ...updateData } = input;
    const result = await client.put(`/api/segment/${id}`, updateData);
    return formatToolResponse(result);
  },
};
