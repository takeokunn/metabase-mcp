import type { MetabaseClient } from '@src/client';
import {
  type GetPreviewEmbedCardTile,
  GetPreviewEmbedCardTileSchema,
} from '@src/schemas/preview-embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPreviewEmbedCardTileDefinition: ToolDefinition<GetPreviewEmbedCardTile> = {
  name: 'get_preview_embed_card_tile',
  description: 'Get a map tile for a preview embedded card in Metabase',
  inputSchema: GetPreviewEmbedCardTileSchema,
  handler: async (client: MetabaseClient, input: GetPreviewEmbedCardTile) => {
    const result = await client.get(
      `/api/preview_embed/tiles/card/${input.token}/${input.zoom}/${input.x}/${input.y}`,
    );
    return formatToolResponse(result);
  },
};
