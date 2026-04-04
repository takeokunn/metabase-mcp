import type { ToolDefinition } from '@src/tools/registry';
import { executeMetricDefinition } from './execute-metric';
import { getMetricDefinition } from './get-metric';
import { getMetricBreakoutValuesDefinition } from './get-metric-breakout-values';
import { listMetricsDefinition } from './list-metrics';

/**
 * All metric-related tool definitions
 */
export const metricTools: ToolDefinition<unknown>[] = [
  listMetricsDefinition,
  getMetricDefinition,
  executeMetricDefinition,
  getMetricBreakoutValuesDefinition,
];
