import type { MetabaseClient } from '@src/client';
import { type UnsubscribeGlobalInput, UnsubscribeGlobalInputSchema } from '@src/schemas/notification';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const unsubscribeNotificationGlobalDefinition: ToolDefinition<UnsubscribeGlobalInput> = {
  name: 'unsubscribe_notification_global',
  description: 'Globally unsubscribe an email from all Metabase notifications',
  inputSchema: UnsubscribeGlobalInputSchema,
  handler: async (client: MetabaseClient, input: UnsubscribeGlobalInput) => {
    const result = await client.post('/api/notification/unsubscribe', {
      email: input.email,
      hash: input.hash,
    });
    return formatToolResponse(result);
  },
};
