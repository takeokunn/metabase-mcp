import type { MetabaseClient } from '@src/client';
import {
  type AddDashboardFavoriteInput,
  AddDashboardFavoriteInputSchema,
} from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

/**
 * Tool definition for adding a dashboard to favorites in Metabase
 */
export const addDashboardFavoriteDefinition: ToolDefinition<AddDashboardFavoriteInput> = {
  name: 'add_dashboard_favorite',
  description: 'Add a dashboard to favorites in Metabase',
  inputSchema: AddDashboardFavoriteInputSchema,
  handler: async (client: MetabaseClient, input: AddDashboardFavoriteInput) => {
    const { dashboard_id } = input;
    const result = await client.post(`/api/dashboard/${dashboard_id}/favorite`, {});
    return formatToolResponse(result);
  },
};
