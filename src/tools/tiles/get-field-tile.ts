import type { MetabaseClient } from '@src/client';
import { type GetFieldTileInput, GetFieldTileInputSchema } from '@src/schemas/tiles';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getFieldTileDefinition: ToolDefinition<GetFieldTileInput> = {
  name: 'get_field_tile',
  description: 'Get a map tile using field coordinates in Metabase',
  inputSchema: GetFieldTileInputSchema,
  handler: async (client: MetabaseClient, input: GetFieldTileInput) => {
    const result = await client.get(`/api/tiles/${input.zoom}/${input.x}/${input.y}/${input.lat_field_id}/${input.lon_field_id}/${input.field_id}/${input.timeseries_enabled}/${input.token}`);
    return formatToolResponse(result);
  },
};
