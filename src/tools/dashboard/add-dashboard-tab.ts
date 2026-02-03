import type { MetabaseClient } from '@src/client';
import { type AddDashboardTabInput, AddDashboardTabInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for adding a tab to a dashboard in Metabase (v0.49+)
 *
 * Note: In v0.49+, tabs are managed via PUT /api/dashboard/:id
 * This tool fetches the current dashboard, adds a new tab with magic ID -2,
 * and updates the dashboard.
 */
export const addDashboardTabDefinition: ToolDefinition<AddDashboardTabInput> = {
  name: 'add_dashboard_tab',
  description: 'Add a new tab to a dashboard in Metabase (v0.49+)',
  inputSchema: AddDashboardTabInputSchema,
  handler: async (client: MetabaseClient, input: AddDashboardTabInput) => {
    const { dashboard_id, name } = input;

    // Fetch current dashboard to get existing tabs and cards
    const dashboard = (await client.get(`/api/dashboard/${dashboard_id}`)) as {
      tabs?: Array<{ id: number; name: string; position?: number }>;
      dashcards?: Array<Record<string, unknown>>;
    };

    const existingTabs = dashboard.tabs || [];
    const existingCards = dashboard.dashcards || [];

    // Create new tab with magic ID -2 (Metabase convention for new tabs)
    const newTab = {
      id: -2,
      name,
      position: existingTabs.length,
    };

    // Update dashboard with new tab
    const result = await client.put(`/api/dashboard/${dashboard_id}`, {
      tabs: [...existingTabs, newTab],
      dashcards: existingCards,
    });

    return formatToolResponse(result);
  },
};
