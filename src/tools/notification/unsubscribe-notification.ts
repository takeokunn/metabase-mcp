import type { MetabaseClient } from '@src/client';
import {
  type UnsubscribeNotificationInput,
  UnsubscribeNotificationInputSchema,
} from '@src/schemas/notification';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const unsubscribeNotificationDefinition: ToolDefinition<UnsubscribeNotificationInput> = {
  name: 'unsubscribe_notification',
  description: 'Unsubscribe from a notification by ID in Metabase',
  inputSchema: UnsubscribeNotificationInputSchema,
  handler: async (client: MetabaseClient, input: UnsubscribeNotificationInput) => {
    const result = await client.post(`/api/notification/${input.id}/unsubscribe`, {
      email: input.email,
    });
    return formatToolResponse(result);
  },
};
