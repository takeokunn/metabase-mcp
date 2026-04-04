import type { ToolDefinition } from '@src/tools/registry';
import { executeQueryDefinition } from './execute-query';
import { executeQueryPivotDefinition } from './execute-query-pivot';
import { exportQueryDefinition } from './export-query';
import { getDatasetParamRemappingDefinition } from './get-dataset-param-remapping';
import { getDatasetParamValuesDefinition } from './get-dataset-param-values';
import { getDatasetQueryMetadataDefinition } from './get-dataset-query-metadata';
import { getNativeQueryDefinition } from './get-native-query';
import { searchDatasetParamValuesDefinition } from './search-dataset-param-values';

/**
 * All dataset-related tool definitions
 */
export const datasetTools: ToolDefinition<unknown>[] = [
  executeQueryDefinition,
  exportQueryDefinition,
  executeQueryPivotDefinition,
  getNativeQueryDefinition,
  getDatasetParamValuesDefinition,
  searchDatasetParamValuesDefinition,
  getDatasetParamRemappingDefinition,
  getDatasetQueryMetadataDefinition,
];
