import type { MetabaseClient } from '@src/client';
import {
  type ListNotificationsParams,
  ListNotificationsParamsSchema,
} from '@src/schemas/notification';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listNotificationsDefinition: ToolDefinition<ListNotificationsParams> = {
  name: 'list_notifications',
  description: 'Get list of notifications from Metabase',
  inputSchema: ListNotificationsParamsSchema,
  handler: async (client: MetabaseClient, input: ListNotificationsParams) => {
    const result = await client.get('/api/notification', {
      archived: input.archived,
      dashboard_id: input.dashboard_id,
    });
    return formatToolResponse(result);
  },
};
