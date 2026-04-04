import type { MetabaseClient } from '@src/client';
import { type AddCommentReactionInput, AddCommentReactionInputSchema } from '@src/schemas/comment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const addCommentReactionDefinition: ToolDefinition<AddCommentReactionInput> = {
  name: 'add_comment_reaction',
  description: 'Add an emoji reaction to a comment in Metabase',
  inputSchema: AddCommentReactionInputSchema,
  handler: async (client: MetabaseClient, input: AddCommentReactionInput) => {
    const result = await client.post(`/api/comment/${input.id}/reaction`, {
      emoji: input.emoji,
    });
    return formatToolResponse(result);
  },
};
