import type { MetabaseClient } from '@src/client';
import { type GetDashboardTileInput, GetDashboardTileInputSchema } from '@src/schemas/tiles';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getDashboardTileDefinition: ToolDefinition<GetDashboardTileInput> = {
  name: 'get_dashboard_tile',
  description: 'Get a map tile for a dashboard card in Metabase',
  inputSchema: GetDashboardTileInputSchema,
  handler: async (client: MetabaseClient, input: GetDashboardTileInput) => {
    const result = await client.get(
      `/api/tiles/${input.dashboard_id}/dashcard/${input.dashcard_id}/card/${input.card_id}/${input.zoom}/${input.x}/${input.y}`,
    );
    return formatToolResponse(result);
  },
};
