import type { MetabaseClient } from '@src/client';
import { type CreateChannelInput, CreateChannelInputSchema } from '@src/schemas/channel';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a new notification channel
 */
export const createChannelDefinition: ToolDefinition<CreateChannelInput> = {
  name: 'create_channel',
  description: 'Create a new notification channel in Metabase',
  inputSchema: CreateChannelInputSchema,
  handler: async (client: MetabaseClient, input: CreateChannelInput) => {
    const result = await client.post('/api/channel', input);
    return formatToolResponse(result);
  },
};
