import type { MetabaseClient } from '@src/client';
import { type AddDashboardCardInput, AddDashboardCardInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for adding a card to a dashboard in Metabase (v0.49+)
 *
 * Note: In v0.49+, dashcards are managed via PUT /api/dashboard/:id
 * This tool fetches the current dashboard, adds a new dashcard with a negative ID,
 * and updates the dashboard.
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

    // Fetch current dashboard to get existing cards and tabs
    const dashboard = (await client.get(`/api/dashboard/${dashboard_id}`)) as {
      tabs?: Array<{ id: number; name: string }>;
      dashcards?: Array<{ id: number } & Record<string, unknown>>;
    };

    const existingTabs = dashboard.tabs || [];
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

    // Update dashboard with new card
    const result = await client.put(`/api/dashboard/${dashboard_id}`, {
      tabs: existingTabs,
      dashcards: [...existingCards, newDashcard],
    });

    return formatToolResponse(result);
  },
};
