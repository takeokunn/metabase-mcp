import type { MetabaseClient } from '@src/client';
import { type GetNotificationParams, GetNotificationParamsSchema } from '@src/schemas/notification';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getNotificationDefinition: ToolDefinition<GetNotificationParams> = {
  name: 'get_notification',
  description: 'Get a notification by ID from Metabase',
  inputSchema: GetNotificationParamsSchema,
  handler: async (client: MetabaseClient, input: GetNotificationParams) => {
    const result = await client.get(`/api/notification/${input.id}`);
    return formatToolResponse(result);
  },
};
