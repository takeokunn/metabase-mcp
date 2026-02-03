import type { MetabaseClient } from '@src/client';
import {
  type ListDashboardSubscriptionsParams,
  ListDashboardSubscriptionsParamsSchema,
} from '@src/schemas/notification';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for listing dashboard subscriptions in Metabase
 *
 * Note: Uses the /api/notification endpoint (v0.49+)
 */
export const listDashboardSubscriptionsDefinition: ToolDefinition<ListDashboardSubscriptionsParams> = {
  name: 'list_dashboard_subscriptions',
  description: 'List dashboard subscriptions (email/Slack notifications) in Metabase',
  inputSchema: ListDashboardSubscriptionsParamsSchema,
  handler: async (client: MetabaseClient, input: ListDashboardSubscriptionsParams) => {
    const { dashboard_id, archived } = input;

    // Build query params
    const params = new URLSearchParams();
    if (dashboard_id !== undefined) {
      params.append('dashboard_id', dashboard_id.toString());
    }
    if (archived !== undefined) {
      params.append('archived', archived.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/api/notification?${queryString}` : '/api/notification';

    const result = await client.get(url);
    return formatToolResponse(result);
  },
};
