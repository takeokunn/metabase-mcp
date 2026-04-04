import type { ToolDefinition } from '@src/tools/registry';
import { getGeoJSONDefinition } from './get-geojson';
import { listGeoJSONDefinition } from './list-geojson';

export const geojsonTools: ToolDefinition<unknown>[] = [
  listGeoJSONDefinition,
  getGeoJSONDefinition,
];
