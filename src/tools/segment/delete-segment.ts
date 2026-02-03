import type { MetabaseClient } from '@src/client';
import { type DeleteSegmentInput, DeleteSegmentInputSchema } from '@src/schemas/segment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a segment from Metabase
 */
export const deleteSegmentDefinition: ToolDefinition<DeleteSegmentInput> = {
  name: 'delete_segment',
  description: 'Delete a segment from Metabase',
  inputSchema: DeleteSegmentInputSchema,
  handler: async (client: MetabaseClient, input: DeleteSegmentInput) => {
    const params = input.revision_message
      ? { revision_message: input.revision_message }
      : undefined;
    const result = await client.delete(`/api/segment/${input.id}`, params);
    return formatToolResponse(result);
  },
};
