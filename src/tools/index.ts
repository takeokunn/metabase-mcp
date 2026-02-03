import { cardTools } from './card';
import { collectionTools } from './collection';
import { dashboardTools } from './dashboard';
import { databaseTools } from './database';
import { datasetTools } from './dataset';
import { fieldTools } from './field';
import { permissionsTools } from './permissions';
import type { ToolDefinition } from './registry';
import { searchTools } from './search';
import { tableTools } from './table';
import { userTools } from './user';

/**
 * All tool definitions combined from all categories
 */
export const allTools: ToolDefinition<unknown>[] = [
  ...databaseTools,
  ...collectionTools,
  ...dashboardTools,
  ...cardTools,
  ...searchTools,
  ...tableTools,
  ...datasetTools,
  ...fieldTools,
  ...userTools,
  ...permissionsTools,
];

export type { ToolDefinition, ToolResponse } from './registry';
export { formatErrorResponse, formatToolResponse, registerTools } from './registry';
