import type { MetabaseClient } from '@src/client';
import { type UpdateChannelInput, UpdateChannelInputSchema } from '@src/schemas/channel';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a notification channel
 */
export const updateChannelDefinition: ToolDefinition<UpdateChannelInput> = {
  name: 'update_channel',
  description: 'Update an existing notification channel in Metabase',
  inputSchema: UpdateChannelInputSchema,
  handler: async (client: MetabaseClient, input: UpdateChannelInput) => {
    const result = await client.put(`/api/channel/${input.id}`, input);
    return formatToolResponse(result);
  },
};
