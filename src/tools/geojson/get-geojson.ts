import type { MetabaseClient } from '@src/client';
import { type GetGeoJSONParams, GetGeoJSONParamsSchema } from '@src/schemas/geojson';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const getGeoJSONDefinition: ToolDefinition<GetGeoJSONParams> = {
  name: 'get_geojson',
  description: 'Get a specific GeoJSON file by key from Metabase',
  inputSchema: GetGeoJSONParamsSchema,
  handler: async (client: MetabaseClient, input: GetGeoJSONParams) => {
    const result = await client.get(`/api/geojson/${input.key}`);
    return formatToolResponse(result);
  },
};
