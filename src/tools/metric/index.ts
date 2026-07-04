import type { ToolDefinition } from '@src/tools/registry';
import { getMetricDefinition } from './get-metric';
import { getMetricBreakoutValuesDefinition } from './get-metric-breakout-values';
import { getMetricDatasetDefinition } from './get-metric-dataset';
import { getMetricDimensionRemappingDefinition } from './get-metric-dimension-remapping';
import { getMetricDimensionValuesDefinition } from './get-metric-dimension-values';
import { listMetricsDefinition } from './list-metrics';
import { searchMetricDimensionValuesDefinition } from './search-metric-dimension-values';

/**
 * All metric-related tool definitions
 */
export const metricTools: ToolDefinition<unknown>[] = [
  listMetricsDefinition,
  getMetricDefinition,
  getMetricDimensionValuesDefinition,
  searchMetricDimensionValuesDefinition,
  getMetricDimensionRemappingDefinition,
  getMetricBreakoutValuesDefinition,
  getMetricDatasetDefinition,
];
