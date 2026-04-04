import type { MetabaseClient } from '@src/client';
import type { ToolDefinition } from '@src/tools/registry';
import { formatToolResponse } from '@src/tools/registry';

export const listGeoJSONDefinition: ToolDefinition = {
  name: 'list_geojson',
  description: 'List all custom GeoJSON files available in Metabase',
  inputSchema: {},
  handler: async (client: MetabaseClient) => {
    const result = await client.get('/api/geojson');
    return formatToolResponse(result);
  },
};
