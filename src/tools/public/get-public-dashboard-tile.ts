import type { MetabaseClient } from '@src/client';
import { type GetPublicDashboardTile, GetPublicDashboardTileSchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicDashboardTileDefinition: ToolDefinition<GetPublicDashboardTile> = {
  name: 'get_public_dashboard_tile',
  description: 'Get a map tile for a public dashboard dashcard in Metabase',
  inputSchema: GetPublicDashboardTileSchema,
  handler: async (client: MetabaseClient, input: GetPublicDashboardTile) => {
    const result = await client.get(
      `/api/public/tiles/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/${input.zoom}/${input.x}/${input.y}`,
    );
    return formatToolResponse(result);
  },
};
