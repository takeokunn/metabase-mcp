import type { MetabaseClient } from '@src/client';
import { type CreateCommentInput, CreateCommentInputSchema } from '@src/schemas/comment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const createCommentDefinition: ToolDefinition<CreateCommentInput> = {
  name: 'create_comment',
  description: 'Create a new comment on a Metabase model',
  inputSchema: CreateCommentInputSchema,
  handler: async (client: MetabaseClient, input: CreateCommentInput) => {
    const result = await client.post('/api/comment', {
      text: input.text,
      model: input.model,
      model_id: input.model_id,
      mentioned_users: input.mentioned_users,
    });
    return formatToolResponse(result);
  },
};
