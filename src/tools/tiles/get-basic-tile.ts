import type { MetabaseClient } from '@src/client';
import { type GetBasicTileInput, GetBasicTileInputSchema } from '@src/schemas/tiles';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getBasicTileDefinition: ToolDefinition<GetBasicTileInput> = {
  name: 'get_basic_tile',
  description: 'Get a basic map tile by zoom level and coordinates in Metabase',
  inputSchema: GetBasicTileInputSchema,
  handler: async (client: MetabaseClient, input: GetBasicTileInput) => {
    const result = await client.get(`/api/tiles/${input.zoom}/${input.x}/${input.y}`);
    return formatToolResponse(result);
  },
};
