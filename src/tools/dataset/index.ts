import type { ToolDefinition } from '@src/tools/registry';
import { executeQueryDefinition } from './execute-query';
import { executeQueryPivotDefinition } from './execute-query-pivot';
import { exportQueryDefinition } from './export-query';
import { getNativeQueryDefinition } from './get-native-query';

/**
 * All dataset-related tool definitions
 */
export const datasetTools: ToolDefinition<unknown>[] = [
  executeQueryDefinition,
  exportQueryDefinition,
  executeQueryPivotDefinition,
  getNativeQueryDefinition,
];
