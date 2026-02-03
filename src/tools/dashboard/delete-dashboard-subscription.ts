import type { MetabaseClient } from '@src/client';
import {
  type DeleteDashboardSubscriptionInput,
  DeleteDashboardSubscriptionInputSchema,
} from '@src/schemas/notification';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for deleting a dashboard subscription in Metabase
 *
 * Note: Uses the /api/notification endpoint (v0.49+)
 */
export const deleteDashboardSubscriptionDefinition: ToolDefinition<DeleteDashboardSubscriptionInput> =
  {
    name: 'delete_dashboard_subscription',
    description: 'Delete a dashboard subscription in Metabase',
    inputSchema: DeleteDashboardSubscriptionInputSchema,
    handler: async (client: MetabaseClient, input: DeleteDashboardSubscriptionInput) => {
      const { id } = input;
      const result = await client.delete(`/api/notification/${id}`);
      return formatToolResponse(result);
    },
  };
