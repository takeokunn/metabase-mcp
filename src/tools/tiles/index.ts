import type { ToolDefinition } from '@src/tools/registry';
import { getCardMapTileDefinition } from './get-card-map-tile';
import { getFieldMapTileDefinition } from './get-field-map-tile';
import { getTableMapTileDefinition } from './get-table-map-tile';

export const tilesTools: ToolDefinition<unknown>[] = [
  getCardMapTileDefinition,
  getFieldMapTileDefinition,
  getTableMapTileDefinition,
];
