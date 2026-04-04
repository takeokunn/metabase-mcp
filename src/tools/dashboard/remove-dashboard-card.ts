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
 * Fetches the current dashcards via GET /api/dashboard/:id, filters out the
 * target dashcard, then writes the remaining cards to PUT /api/dashboard/:id/cards.
 */
export const removeDashboardCardDefinition: ToolDefinition<RemoveDashboardCardInput> = {
  name: 'remove_dashboard_card',
  description: 'Remove a card from a dashboard in Metabase (v0.49+)',
  inputSchema: RemoveDashboardCardInputSchema,
  handler: async (client: MetabaseClient, input: RemoveDashboardCardInput) => {
    const { dashboard_id, dashcard_id } = input;

    // Fetch current dashboard
    const dashboard = (await client.get(`/api/dashboard/${dashboard_id}`)) as {
      dashcards?: Array<{ id: number } & Record<string, unknown>>;
    };

    const existingCards = dashboard.dashcards || [];

    // Remove the target dashcard
    const updatedCards = existingCards.filter((card) => card.id !== dashcard_id);

    // Update dashcards via dedicated endpoint
    const result = await client.put(`/api/dashboard/${dashboard_id}/cards`, {
      cards: updatedCards,
    });

    return formatToolResponse(result);
  },
};
