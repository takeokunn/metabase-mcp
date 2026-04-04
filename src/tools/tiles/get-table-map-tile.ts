import type { MetabaseClient } from '@src/client';
import { type GetTableMapTileParams, GetTableMapTileParamsSchema } from '@src/schemas/tiles';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getTableMapTileDefinition: ToolDefinition<GetTableMapTileParams> = {
  name: 'get_table_map_tile',
  description: 'Get a map tile PNG for table data, optionally filtered by card ID',
  inputSchema: GetTableMapTileParamsSchema,
  handler: async (client: MetabaseClient, input: GetTableMapTileParams) => {
    const params = input.card_id ? { 'card-id': input.card_id } : undefined;
    const result = await client.get(
      `/api/tiles/${input.zoom}/${input.x}/${input.y}`,
      params,
    );
    return formatToolResponse(result);
  },
};
