import type { MetabaseClient } from '@src/client';
import { type SaveDashboardToCollectionInput, SaveDashboardToCollectionInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const saveDashboardToCollectionDefinition: ToolDefinition<SaveDashboardToCollectionInput> = {
  name: 'save_dashboard_to_collection',
  description: 'Save a dashboard to a specific collection in Metabase',
  inputSchema: SaveDashboardToCollectionInputSchema,
  handler: async (client: MetabaseClient, input: SaveDashboardToCollectionInput) => {
    const result = await client.post(`/api/dashboard/save/collection/${input.parent_collection_id}`, input.dashboard);
    return formatToolResponse(result);
  },
};
