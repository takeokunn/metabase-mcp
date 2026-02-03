import type { MetabaseClient } from '@src/client';
import {
  type RemoveDashboardFavoriteInput,
  RemoveDashboardFavoriteInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for removing a dashboard from favorites in Metabase
 */
export const removeDashboardFavoriteDefinition: ToolDefinition<RemoveDashboardFavoriteInput> = {
  name: 'remove_dashboard_favorite',
  description: 'Remove a dashboard from favorites in Metabase',
  inputSchema: RemoveDashboardFavoriteInputSchema,
  handler: async (client: MetabaseClient, input: RemoveDashboardFavoriteInput) => {
    const { dashboard_id } = input;
    const result = await client.delete(`/api/dashboard/${dashboard_id}/favorite`);
    return formatToolResponse(result);
  },
};
