import type { MetabaseClient } from '@src/client';
import {
  type DeleteAlertSubscriptionInput,
  DeleteAlertSubscriptionInputSchema,
} from '@src/schemas/alert';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const deleteAlertSubscriptionDefinition: ToolDefinition<DeleteAlertSubscriptionInput> = {
  name: 'delete_alert_subscription',
  description: 'Delete subscription to an alert in Metabase',
  inputSchema: DeleteAlertSubscriptionInputSchema,
  handler: async (client: MetabaseClient, input: DeleteAlertSubscriptionInput) => {
    const result = await client.delete(`/api/alert/${input.id}/subscription`);
    return formatToolResponse(result);
  },
};
