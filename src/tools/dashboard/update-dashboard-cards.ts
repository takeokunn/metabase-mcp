import type { MetabaseClient } from '@src/client';
import {
  type UpdateDashboardCardsInput,
  UpdateDashboardCardsInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for bulk updating dashboard cards in Metabase (v0.49+)
 *
 * Accepts an array of complete dashcard objects and PUTs them directly to
 * PUT /api/dashboard/:id/cards. Cards not in the payload are removed.
 * Use negative IDs for new cards (the server assigns real IDs).
 */
export const updateDashboardCardsDefinition: ToolDefinition<UpdateDashboardCardsInput> = {
  name: 'update_dashboard_cards',
  description:
    'Bulk update dashboard cards in Metabase (v0.49+). Cards not in payload are removed.',
  inputSchema: UpdateDashboardCardsInputSchema,
  handler: async (client: MetabaseClient, input: UpdateDashboardCardsInput) => {
    const { dashboard_id, cards } = input;

    // Format cards for the API
    const formattedCards = cards.map((card) => ({
      id: card.id,
      card_id: card.card_id ?? null,
      row: card.row,
      col: card.col,
      size_x: card.size_x,
      size_y: card.size_y,
      dashboard_tab_id: card.dashboard_tab_id ?? null,
      parameter_mappings: card.parameter_mappings ?? [],
      visualization_settings: card.visualization_settings ?? {},
      series: [],
    }));

    // Update dashcards via dedicated endpoint
    const result = await client.put(`/api/dashboard/${dashboard_id}/cards`, {
      cards: formattedCards,
    });

    return formatToolResponse(result);
  },
};
