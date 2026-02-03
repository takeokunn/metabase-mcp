import type { MetabaseClient } from '@src/client';
import {
  type RemoveDashboardCardInput,
  RemoveDashboardCardInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for removing a card from a dashboard in Metabase (v0.49+)
 *
 * Note: In v0.49+, dashcards are managed via PUT /api/dashboard/:id
 * This tool fetches the current dashboard, removes the specified dashcard,
 * and saves the changes.
 */
export const removeDashboardCardDefinition: ToolDefinition<RemoveDashboardCardInput> = {
  name: 'remove_dashboard_card',
  description: 'Remove a card from a dashboard in Metabase (v0.49+)',
  inputSchema: RemoveDashboardCardInputSchema,
  handler: async (client: MetabaseClient, input: RemoveDashboardCardInput) => {
    const { dashboard_id, dashcard_id } = input;

    // Fetch current dashboard
    const dashboard = (await client.get(`/api/dashboard/${dashboard_id}`)) as {
      tabs?: Array<{ id: number; name: string }>;
      dashcards?: Array<{ id: number } & Record<string, unknown>>;
    };

    const existingTabs = dashboard.tabs || [];
    const existingCards = dashboard.dashcards || [];

    // Remove the target dashcard
    const updatedCards = existingCards.filter((card) => card.id !== dashcard_id);

    // Update dashboard
    const result = await client.put(`/api/dashboard/${dashboard_id}`, {
      tabs: existingTabs,
      dashcards: updatedCards,
    });

    return formatToolResponse(result);
  },
};
