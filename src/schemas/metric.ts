import { z } from 'zod';
import { IdSchema } from './common';

// Metric ID schema (positive integer)
export const MetricIdSchema = IdSchema;

// List metrics input schema (no parameters)
export const ListMetricsInputSchema = z.object({});

// Get metric params schema
export const GetMetricParamsSchema = z.object({
  id: z.number().int().positive().describe('Metric ID'),
});

// Get metric dimension values params schema
export const GetMetricDimensionValuesParamsSchema = z.object({
  id: z.number().int().positive().describe('Metric ID'),
  dimension_key: z.string().describe('Dimension key of the metric'),
});

// Search metric dimension values params schema
export const SearchMetricDimensionValuesParamsSchema = z.object({
  id: z.number().int().positive().describe('Metric ID'),
  dimension_key: z.string().describe('Dimension key of the metric'),
  query: z.string().describe('Search query string'),
});

// Get metric dimension remapping params schema
export const GetMetricDimensionRemappingParamsSchema = z.object({
  id: z.number().int().positive().describe('Metric ID'),
  dimension_key: z.string().describe('Dimension key of the metric'),
  value: z.string().describe('Value to remap'),
});

// Get metric breakout values input schema
export const GetMetricBreakoutValuesInputSchema = z.object({
  definition: z
    .record(z.string(), z.unknown())
    .describe('MBQL metric definition to compute breakout values for'),
});

// Get metric dataset input schema
export const GetMetricDatasetInputSchema = z.object({
  definition: z
    .record(z.string(), z.unknown())
    .describe('MBQL metric definition to run as a dataset query'),
});

// Inferred types
export type MetricId = z.infer<typeof MetricIdSchema>;
export type ListMetricsInput = z.infer<typeof ListMetricsInputSchema>;
export type GetMetricParams = z.infer<typeof GetMetricParamsSchema>;
export type GetMetricDimensionValuesParams = z.infer<typeof GetMetricDimensionValuesParamsSchema>;
export type SearchMetricDimensionValuesParams = z.infer<
  typeof SearchMetricDimensionValuesParamsSchema
>;
export type GetMetricDimensionRemappingParams = z.infer<
  typeof GetMetricDimensionRemappingParamsSchema
>;
export type GetMetricBreakoutValuesInput = z.infer<typeof GetMetricBreakoutValuesInputSchema>;
export type GetMetricDatasetInput = z.infer<typeof GetMetricDatasetInputSchema>;
