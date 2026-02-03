import type { MetabaseClient } from '@src/client';
import { type UpdateDashboardCardInput, UpdateDashboardCardInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a dashboard card in Metabase (v0.49+)
 *
 * Note: In v0.49+, dashcards are managed via PUT /api/dashboard/:id
 * This tool fetches the current dashboard, updates the specified dashcard,
 * and saves the changes.
 */
export const updateDashboardCardDefinition: ToolDefinition<UpdateDashboardCardInput> = {
  name: 'update_dashboard_card',
  description: 'Update a dashboard card position, size, or settings in Metabase (v0.49+)',
  inputSchema: UpdateDashboardCardInputSchema,
  handler: async (client: MetabaseClient, input: UpdateDashboardCardInput) => {
    const {
      dashboard_id,
      dashcard_id,
      row,
      col,
      size_x,
      size_y,
      dashboard_tab_id,
      parameter_mappings,
      visualization_settings,
    } = input;

    // Fetch current dashboard
    const dashboard = (await client.get(`/api/dashboard/${dashboard_id}`)) as {
      tabs?: Array<{ id: number; name: string }>;
      dashcards?: Array<{ id: number } & Record<string, unknown>>;
    };

    const existingTabs = dashboard.tabs || [];
    const existingCards = dashboard.dashcards || [];

    // Find and update the target dashcard
    const updatedCards = existingCards.map((card) => {
      if (card.id === dashcard_id) {
        return {
          ...card,
          ...(row !== undefined && { row }),
          ...(col !== undefined && { col }),
          ...(size_x !== undefined && { size_x }),
          ...(size_y !== undefined && { size_y }),
          ...(dashboard_tab_id !== undefined && { dashboard_tab_id }),
          ...(parameter_mappings !== undefined && { parameter_mappings }),
          ...(visualization_settings !== undefined && { visualization_settings }),
        };
      }
      return card;
    });

    // Update dashboard
    const result = await client.put(`/api/dashboard/${dashboard_id}`, {
      tabs: existingTabs,
      dashcards: updatedCards,
    });

    return formatToolResponse(result);
  },
};
