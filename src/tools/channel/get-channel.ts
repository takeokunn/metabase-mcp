import type { MetabaseClient } from '@src/client';
import { type GetChannelParams, GetChannelParamsSchema } from '@src/schemas/channel';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for getting a specific notification channel by ID
 */
export const getChannelDefinition: ToolDefinition<GetChannelParams> = {
  name: 'get_channel',
  description: 'Get a specific notification channel by ID in Metabase',
  inputSchema: GetChannelParamsSchema,
  handler: async (client: MetabaseClient, input: GetChannelParams) => {
    const result = await client.get(`/api/channel/${input.id}`);
    return formatToolResponse(result);
  },
};
