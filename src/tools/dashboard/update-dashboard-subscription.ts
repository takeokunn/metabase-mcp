import type { MetabaseClient } from '@src/client';
import {
  type UpdateDashboardSubscriptionInput,
  UpdateDashboardSubscriptionInputSchema,
} from '@src/schemas/notification';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a dashboard subscription in Metabase
 *
 * Note: Uses the /api/notification endpoint (v0.49+)
 */
export const updateDashboardSubscriptionDefinition: ToolDefinition<UpdateDashboardSubscriptionInput> =
  {
    name: 'update_dashboard_subscription',
    description: 'Update a dashboard subscription (email/Slack notification) in Metabase',
    inputSchema: UpdateDashboardSubscriptionInputSchema,
    handler: async (client: MetabaseClient, input: UpdateDashboardSubscriptionInput) => {
      const { id, channels, parameters, archived } = input;

      const updateData: Record<string, unknown> = {};
      if (channels !== undefined) {
        updateData.channels = channels;
      }
      if (parameters !== undefined) {
        updateData.parameters = parameters;
      }
      if (archived !== undefined) {
        updateData.archived = archived;
      }

      const result = await client.put(`/api/notification/${id}`, updateData);
      return formatToolResponse(result);
    },
  };
