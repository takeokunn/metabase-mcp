import type { ToolDefinition } from '@src/tools/registry';
import { executeQueryDefinition } from './execute-query';
import { exportQueryDefinition } from './export-query';

/**
 * All dataset-related tool definitions
 */
export const datasetTools: ToolDefinition<unknown>[] = [
  executeQueryDefinition,
  exportQueryDefinition,
];
