import type { MetabaseClient } from '@src/client';
import {
  type UpdateDashboardCardInput,
  UpdateDashboardCardInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for updating a dashboard card in Metabase (v0.49+)
 *
 * Fetches the current dashcards via GET /api/dashboard/:id, merges updates
 * into the target dashcard, then writes all cards to PUT /api/dashboard/:id/cards.
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
      dashcards?: Array<{ id: number } & Record<string, unknown>>;
    };

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

    // Update dashcards via dedicated endpoint
    const result = await client.put(`/api/dashboard/${dashboard_id}/cards`, {
      cards: updatedCards,
    });

    return formatToolResponse(result);
  },
};
