import type { MetabaseClient } from '@src/client';
import { type UpdateCommentInput, UpdateCommentInputSchema } from '@src/schemas/comment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const updateCommentDefinition: ToolDefinition<UpdateCommentInput> = {
  name: 'update_comment',
  description: 'Update an existing comment in Metabase',
  inputSchema: UpdateCommentInputSchema,
  handler: async (client: MetabaseClient, input: UpdateCommentInput) => {
    const result = await client.put(`/api/comment/${input.id}`, {
      text: input.text,
    });
    return formatToolResponse(result);
  },
};
