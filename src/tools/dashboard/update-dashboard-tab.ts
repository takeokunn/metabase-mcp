import type { MetabaseClient } from '@src/client';
import { type UpdateDashboardTabInput, UpdateDashboardTabInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a dashboard tab in Metabase (v0.49+)
 *
 * Note: In v0.49+, tabs are managed via PUT /api/dashboard/:id
 * This tool fetches the current dashboard, updates the specified tab,
 * and saves the changes.
 */
export const updateDashboardTabDefinition: ToolDefinition<UpdateDashboardTabInput> = {
  name: 'update_dashboard_tab',
  description: 'Update a dashboard tab name or position in Metabase (v0.49+)',
  inputSchema: UpdateDashboardTabInputSchema,
  handler: async (client: MetabaseClient, input: UpdateDashboardTabInput) => {
    const { dashboard_id, tab_id, name, position } = input;

    // Fetch current dashboard
    const dashboard = (await client.get(`/api/dashboard/${dashboard_id}`)) as {
      tabs?: Array<{ id: number; name: string; position?: number }>;
      dashcards?: Array<Record<string, unknown>>;
    };

    const existingTabs = dashboard.tabs || [];
    const existingCards = dashboard.dashcards || [];

    // Find and update the target tab
    const updatedTabs = existingTabs.map((tab) => {
      if (tab.id === tab_id) {
        return {
          ...tab,
          ...(name !== undefined && { name }),
          ...(position !== undefined && { position }),
        };
      }
      return tab;
    });

    // If position was updated, reorder tabs
    if (position !== undefined) {
      updatedTabs.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }

    // Update dashboard
    const result = await client.put(`/api/dashboard/${dashboard_id}`, {
      tabs: updatedTabs,
      dashcards: existingCards,
    });

    return formatToolResponse(result);
  },
};
