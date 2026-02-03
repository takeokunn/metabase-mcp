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
 * Note: In v0.49+, dashcards are managed via PUT /api/dashboard/:id
 * This tool allows updating multiple dashcards at once, including:
 * - Adding new cards (use negative IDs)
 * - Updating existing cards
 * - Cards not in the payload will be removed
 */
export const updateDashboardCardsDefinition: ToolDefinition<UpdateDashboardCardsInput> = {
  name: 'update_dashboard_cards',
  description:
    'Bulk update dashboard cards in Metabase (v0.49+). Cards not in payload are removed.',
  inputSchema: UpdateDashboardCardsInputSchema,
  handler: async (client: MetabaseClient, input: UpdateDashboardCardsInput) => {
    const { dashboard_id, cards, ordered_tabs } = input;

    // Fetch current dashboard to get existing tabs if not provided
    const dashboard = (await client.get(`/api/dashboard/${dashboard_id}`)) as {
      tabs?: Array<{ id: number; name: string }>;
    };

    const tabs = ordered_tabs ?? dashboard.tabs ?? [];

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

    // Update dashboard with all cards
    const result = await client.put(`/api/dashboard/${dashboard_id}`, {
      tabs,
      dashcards: formattedCards,
    });

    return formatToolResponse(result);
  },
};
