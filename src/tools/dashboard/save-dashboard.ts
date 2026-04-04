import type { MetabaseClient } from '@src/client';
import { type SaveDashboardInput, SaveDashboardInputSchema } from '@src/schemas/dashboard';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const saveDashboardDefinition: ToolDefinition<SaveDashboardInput> = {
  name: 'save_dashboard',
  description: 'Save a dashboard (creates or updates) in Metabase',
  inputSchema: SaveDashboardInputSchema,
  handler: async (client: MetabaseClient, input: SaveDashboardInput) => {
    const result = await client.post('/api/dashboard/save', input.dashboard);
    return formatToolResponse(result);
  },
};
