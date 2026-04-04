import type { MetabaseClient } from '@src/client';
import { type GetPublicCardTile, GetPublicCardTileSchema } from '@src/schemas/public';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getPublicCardTileDefinition: ToolDefinition<GetPublicCardTile> = {
  name: 'get_public_card_tile',
  description: 'Get a map tile for a public card in Metabase',
  inputSchema: GetPublicCardTileSchema,
  handler: async (client: MetabaseClient, input: GetPublicCardTile) => {
    const result = await client.get(
      `/api/public/tiles/card/${input.uuid}/${input.zoom}/${input.x}/${input.y}`,
    );
    return formatToolResponse(result);
  },
};
