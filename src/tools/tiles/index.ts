import type { ToolDefinition } from '@src/tools/registry';
import { getBasicTileDefinition } from './get-basic-tile';
import { getCardMapTileDefinition } from './get-card-map-tile';
import { getCardTileDefinition } from './get-card-tile';
import { getDashboardTileDefinition } from './get-dashboard-tile';
import { getFieldMapTileDefinition } from './get-field-map-tile';
import { getFieldTileDefinition } from './get-field-tile';
import { getTableMapTileDefinition } from './get-table-map-tile';

export const tilesTools: ToolDefinition<unknown>[] = [
  getCardMapTileDefinition,
  getFieldMapTileDefinition,
  getTableMapTileDefinition,
  getCardTileDefinition,
  getDashboardTileDefinition,
  getFieldTileDefinition,
  getBasicTileDefinition,
];
