import type { MetabaseClient } from '@src/client';
import { type GetEmbedDashboardTile, GetEmbedDashboardTileSchema } from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedDashboardTileDefinition: ToolDefinition<GetEmbedDashboardTile> = {
  name: 'get_embed_dashboard_tile',
  description: 'Get a map tile for an embedded dashboard dashcard in Metabase',
  inputSchema: GetEmbedDashboardTileSchema,
  handler: async (client: MetabaseClient, input: GetEmbedDashboardTile) => {
    const result = await client.get(
      `/api/embed/tiles/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/${input.zoom}/${input.x}/${input.y}`,
    );
    return formatToolResponse(result);
  },
};
