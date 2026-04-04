import type { MetabaseClient } from '@src/client';
import {
  type SendNotificationParams,
  SendNotificationParamsSchema,
} from '@src/schemas/notification';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const sendNotificationDefinition: ToolDefinition<SendNotificationParams> = {
  name: 'send_notification',
  description: 'Send a notification immediately by ID in Metabase',
  inputSchema: SendNotificationParamsSchema,
  handler: async (client: MetabaseClient, input: SendNotificationParams) => {
    const result = await client.post(`/api/notification/${input.id}/send`, {});
    return formatToolResponse(result);
  },
};
