import type { MetabaseClient } from '@src/client';
import { type GetCardMapTileParams, GetCardMapTileParamsSchema } from '@src/schemas/tiles';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getCardMapTileDefinition: ToolDefinition<GetCardMapTileParams> = {
  name: 'get_card_map_tile',
  description: 'Get a map tile PNG for a card with latitude/longitude fields',
  inputSchema: GetCardMapTileParamsSchema,
  handler: async (client: MetabaseClient, input: GetCardMapTileParams) => {
    const params = input.query ? { query: input.query } : undefined;
    const result = await client.get(
      `/api/tiles/${input.card_id}/${input.zoom}/${input.x}/${input.y}/${encodeURIComponent(input.lat_field)}/${encodeURIComponent(input.lon_field)}/tile.png`,
      params,
    );
    return formatToolResponse(result);
  },
};
