import type { MetabaseClient } from '@src/client';
import { type DeleteCommentParams, DeleteCommentParamsSchema } from '@src/schemas/comment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deleteCommentDefinition: ToolDefinition<DeleteCommentParams> = {
  name: 'delete_comment',
  description: 'Delete a comment from Metabase',
  inputSchema: DeleteCommentParamsSchema,
  handler: async (client: MetabaseClient, input: DeleteCommentParams) => {
    const result = await client.delete(`/api/comment/${input.id}`);
    return formatToolResponse(result);
  },
};
