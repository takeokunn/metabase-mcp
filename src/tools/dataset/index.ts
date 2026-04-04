import type { ToolDefinition } from '@src/tools/registry';
import { executeQueryDefinition } from './execute-query';
import { executeQueryPivotDefinition } from './execute-query-pivot';
import { exportQueryDefinition } from './export-query';
import { formatQueryDefinition } from './format-query';
import { getNativeQueryDefinition } from './get-native-query';
import { getQueryDurationDefinition } from './get-query-duration';

/**
 * All dataset-related tool definitions
 */
export const datasetTools: ToolDefinition<unknown>[] = [
  executeQueryDefinition,
  exportQueryDefinition,
  executeQueryPivotDefinition,
  getNativeQueryDefinition,
  getQueryDurationDefinition,
  formatQueryDefinition,
];
