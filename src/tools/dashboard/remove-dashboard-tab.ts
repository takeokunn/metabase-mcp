import type { MetabaseClient } from '@src/client';
import {
  type RemoveDashboardTabInput,
  RemoveDashboardTabInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for removing a tab from a dashboard in Metabase (v0.49+)
 *
 * Note: In v0.49+, tabs are managed via PUT /api/dashboard/:id
 * This tool fetches the current dashboard, removes the specified tab
 * (and optionally its cards), and saves the changes.
 */
export const removeDashboardTabDefinition: ToolDefinition<RemoveDashboardTabInput> = {
  name: 'remove_dashboard_tab',
  description: 'Remove a tab from a dashboard in Metabase (v0.49+)',
  inputSchema: RemoveDashboardTabInputSchema,
  handler: async (client: MetabaseClient, input: RemoveDashboardTabInput) => {
    const { dashboard_id, tab_id } = input;

    // Fetch current dashboard
    const dashboard = (await client.get(`/api/dashboard/${dashboard_id}`)) as {
      tabs?: Array<{ id: number; name: string; position?: number }>;
      dashcards?: Array<{ id: number; dashboard_tab_id?: number | null } & Record<string, unknown>>;
    };

    const existingTabs = dashboard.tabs || [];
    const existingCards = dashboard.dashcards || [];

    // Remove the target tab
    const updatedTabs = existingTabs.filter((tab) => tab.id !== tab_id);

    // Remove cards that belong to the removed tab
    const updatedCards = existingCards.filter((card) => card.dashboard_tab_id !== tab_id);

    // Update dashboard
    const result = await client.put(`/api/dashboard/${dashboard_id}`, {
      tabs: updatedTabs,
      dashcards: updatedCards,
    });

    return formatToolResponse(result);
  },
};
