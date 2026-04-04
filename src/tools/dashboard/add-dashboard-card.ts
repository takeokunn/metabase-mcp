import type { MetabaseClient } from '@src/client';
import { type AddDashboardCardInput, AddDashboardCardInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for adding a card to a dashboard in Metabase (v0.49+)
 *
 * Fetches the current dashcards via GET /api/dashboard/:id, appends the new
 * dashcard with a server-assigned negative ID, then writes the full updated
 * array to PUT /api/dashboard/:id/cards.
 */
export const addDashboardCardDefinition: ToolDefinition<AddDashboardCardInput> = {
  name: 'add_dashboard_card',
  description: 'Add a card to a dashboard in Metabase (v0.49+)',
  inputSchema: AddDashboardCardInputSchema,
  handler: async (client: MetabaseClient, input: AddDashboardCardInput) => {
    const {
      dashboard_id,
      card_id,
      row,
      col,
      size_x,
      size_y,
      dashboard_tab_id,
      parameter_mappings,
      visualization_settings,
      virtual_card,
    } = input;

    // Fetch current dashboard to get existing cards
    const dashboard = (await client.get(`/api/dashboard/${dashboard_id}`)) as {
      dashcards?: Array<{ id: number } & Record<string, unknown>>;
    };

    const existingCards = dashboard.dashcards || [];

    // Find the minimum ID to ensure new card has unique negative ID
    const minId = existingCards.reduce((min, card) => Math.min(min, card.id), 0);
    const newCardId = minId - 1;

    // Create new dashcard
    const newDashcard: Record<string, unknown> = {
      id: newCardId,
      card_id: card_id ?? null,
      row,
      col,
      size_x,
      size_y,
      dashboard_tab_id: dashboard_tab_id ?? null,
      parameter_mappings: parameter_mappings ?? [],
      visualization_settings: visualization_settings ?? {},
      series: [],
    };

    // Add virtual_card if provided (for text/heading cards)
    if (virtual_card) {
      newDashcard.virtual_card = virtual_card;
    }

    // Update dashcards via dedicated endpoint
    const result = await client.put(`/api/dashboard/${dashboard_id}/cards`, {
      cards: [...existingCards, newDashcard],
    });

    return formatToolResponse(result);
  },
};
