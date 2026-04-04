import type { MetabaseClient } from '@src/client';
import { type GetFieldMapTileParams, GetFieldMapTileParamsSchema } from '@src/schemas/tiles';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getFieldMapTileDefinition: ToolDefinition<GetFieldMapTileParams> = {
  name: 'get_field_map_tile',
  description: 'Get a map tile PNG using field IDs for latitude and longitude',
  inputSchema: GetFieldMapTileParamsSchema,
  handler: async (client: MetabaseClient, input: GetFieldMapTileParams) => {
    const result = await client.get(
      `/api/tiles/${input.zoom}/${input.x}/${input.y}/${input.lat_field_id}/${input.lon_field_id}/tile.png`,
    );
    return formatToolResponse(result);
  },
};
