import type { MetabaseClient } from '@src/client';
import { type SendAdhocNotificationInput, SendAdhocNotificationInputSchema } from '@src/schemas/notification';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const sendAdhocNotificationDefinition: ToolDefinition<SendAdhocNotificationInput> = {
  name: 'send_adhoc_notification',
  description: 'Send an ad-hoc notification in Metabase',
  inputSchema: SendAdhocNotificationInputSchema,
  handler: async (client: MetabaseClient, input: SendAdhocNotificationInput) => {
    const result = await client.post('/api/notification/send', input.notification);
    return formatToolResponse(result);
  },
};
