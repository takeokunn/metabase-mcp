import type { MetabaseClient } from '@src/client';
import {
  type GetPreviewEmbedDashboardTile,
  GetPreviewEmbedDashboardTileSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPreviewEmbedDashboardTileDefinition: ToolDefinition<GetPreviewEmbedDashboardTile> =
  {
    name: 'get_preview_embed_dashboard_tile',
    description: 'Get a map tile for a preview embedded dashboard dashcard in Metabase',
    inputSchema: GetPreviewEmbedDashboardTileSchema,
    handler: async (client: MetabaseClient, input: GetPreviewEmbedDashboardTile) => {
      const result = await client.get(
        `/api/preview_embed/tiles/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/${input.zoom}/${input.x}/${input.y}`,
      );
      return formatToolResponse(result);
    },
  };
