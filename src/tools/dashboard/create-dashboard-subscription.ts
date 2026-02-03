import type { MetabaseClient } from '@src/client';
import {
  type CreateDashboardSubscriptionInput,
  CreateDashboardSubscriptionInputSchema,
} from '@src/schemas/notification';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for creating a dashboard subscription in Metabase
 *
 * Note: Uses the /api/notification endpoint (v0.49+)
 * Subscriptions allow users to receive dashboard updates via email or Slack
 */
export const createDashboardSubscriptionDefinition: ToolDefinition<CreateDashboardSubscriptionInput> =
  {
    name: 'create_dashboard_subscription',
    description: 'Create a dashboard subscription (email/Slack notification) in Metabase',
    inputSchema: CreateDashboardSubscriptionInputSchema,
    handler: async (client: MetabaseClient, input: CreateDashboardSubscriptionInput) => {
      const { dashboard_id, channels, parameters } = input;

      const result = await client.post('/api/notification', {
        dashboard_id,
        channels,
        parameters: parameters ?? [],
      });

      return formatToolResponse(result);
    },
  };
