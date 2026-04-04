import type { MetabaseClient } from '@src/client';
import { type GetCardTileInput, GetCardTileInputSchema } from '@src/schemas/tiles';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getCardTileDefinition: ToolDefinition<GetCardTileInput> = {
  name: 'get_card_tile',
  description: 'Get a map tile for a card in Metabase',
  inputSchema: GetCardTileInputSchema,
  handler: async (client: MetabaseClient, input: GetCardTileInput) => {
    const result = await client.get(`/api/tiles/${input.card_id}/${input.zoom}/${input.x}/${input.y}`);
    return formatToolResponse(result);
  },
};
