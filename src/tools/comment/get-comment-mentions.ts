import type { MetabaseClient } from '@src/client';
import { type GetCommentMentionsInput, GetCommentMentionsInputSchema } from '@src/schemas/comment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getCommentMentionsDefinition: ToolDefinition<GetCommentMentionsInput> = {
  name: 'get_comment_mentions',
  description: 'Get comment mentions for the current user in Metabase',
  inputSchema: GetCommentMentionsInputSchema,
  handler: async (client: MetabaseClient, _input: GetCommentMentionsInput) => {
    const result = await client.get('/api/comment/mentions');
    return formatToolResponse(result);
  },
};
