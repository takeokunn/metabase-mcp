import type { MetabaseClient } from '@src/client';
import { type ListCommentsParams, ListCommentsParamsSchema } from '@src/schemas/comment';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listCommentsDefinition: ToolDefinition<ListCommentsParams> = {
  name: 'list_comments',
  description: 'List comments in Metabase, optionally filtered by model type and ID',
  inputSchema: ListCommentsParamsSchema,
  handler: async (client: MetabaseClient, input: ListCommentsParams) => {
    const result = await client.get('/api/comment', {
      model: input.model,
      model_id: input.model_id,
    });
    return formatToolResponse(result);
  },
};
