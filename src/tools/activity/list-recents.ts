import type { MetabaseClient } from '@src/client';
import { type ListRecentsParams, ListRecentsParamsSchema } from '@src/schemas/activity';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listRecentsDefinition: ToolDefinition<ListRecentsParams> = {
  name: 'list_recents',
  description: 'List recent items in Metabase with optional context filter',
  inputSchema: ListRecentsParamsSchema,
  handler: async (client: MetabaseClient, input: ListRecentsParams) => {
    const params: Record<string, string | undefined> = {};
    if (input.context !== undefined) {
      params.context = input.context;
    }
    const result = await client.get('/api/activity/recents', Object.keys(params).length > 0 ? params : undefined);
    return formatToolResponse(result);
  },
};
