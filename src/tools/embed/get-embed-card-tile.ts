import type { MetabaseClient } from '@src/client';
import { type GetEmbedCardTile, GetEmbedCardTileSchema } from '@src/schemas/embed';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getEmbedCardTileDefinition: ToolDefinition<GetEmbedCardTile> = {
  name: 'get_embed_card_tile',
  description: 'Get a map tile for an embedded card in Metabase',
  inputSchema: GetEmbedCardTileSchema,
  handler: async (client: MetabaseClient, input: GetEmbedCardTile) => {
    const result = await client.get(
      `/api/embed/tiles/card/${input.token}/${input.zoom}/${input.x}/${input.y}`,
    );
    return formatToolResponse(result);
  },
};
