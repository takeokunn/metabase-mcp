import { z } from 'zod';
import { IdSchema } from './common';

// Metric ID schema (positive integer)
export const MetricIdSchema = IdSchema;

// Get metric params schema
export const GetMetricParamsSchema = z.object({
  id: z.number().int().positive().describe('Metric ID'),
});

// Execute metric input schema
export const ExecuteMetricInputSchema = z.object({
  query: z.record(z.string(), z.unknown()).describe('MBQL query for the metric'),
});

// Get metric breakout values input schema
export const GetMetricBreakoutValuesInputSchema = z.object({
  metric_id: z.number().int().positive().describe('ID of the metric to get breakout values for'),
  dimension: z.record(z.string(), z.unknown()).describe('Breakout dimension definition'),
});

// Inferred types
export type MetricId = z.infer<typeof MetricIdSchema>;
export type GetMetricParams = z.infer<typeof GetMetricParamsSchema>;
export type ExecuteMetricInput = z.infer<typeof ExecuteMetricInputSchema>;
export type GetMetricBreakoutValuesInput = z.infer<typeof GetMetricBreakoutValuesInputSchema>;
