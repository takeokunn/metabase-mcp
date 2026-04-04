import { z } from 'zod';
import { IdSchema } from './common';

// Query type enum
export const QueryTypeSchema = z.enum(['query', 'native']);

// Dataset query schema for MBQL queries
export const DatasetQuerySchema = z.object({
  database: IdSchema.describe('Database ID to run query against'),
  type: QueryTypeSchema.describe('Query type: "query" for MBQL or "native" for SQL'),
  query: z.record(z.unknown()).optional().describe('MBQL query object'),
  native: z.record(z.unknown()).optional().describe('Native SQL query object'),
});

// Execute query input schema
export const ExecuteQueryInputSchema = z.object({
  database: IdSchema.describe('Database ID to run query against'),
  type: QueryTypeSchema.describe('Query type: "query" for MBQL or "native" for SQL'),
  query: z.record(z.unknown()).optional().describe('MBQL query object'),
  native: z
    .object({
      query: z.string().describe('Native SQL query string'),
      'template-tags': z
        .record(z.unknown())
        .optional()
        .describe('Template tag definitions for parameterized queries'),
    })
    .optional()
    .describe('Native SQL query with template tags'),
});

// Export format enum
export const ExportFormatSchema = z.enum(['csv', 'json', 'xlsx']);

// Export query input schema
export const ExportQueryInputSchema = ExecuteQueryInputSchema.extend({
  format: ExportFormatSchema.describe('Export format: csv, json, or xlsx'),
});

// Execute pivot query input schema
export const ExecutePivotQueryInputSchema = z.object({
  query: z.record(z.unknown()).describe('MBQL pivot query object'),
});

// Get native query input schema
export const GetNativeQueryInputSchema = z.object({
  query: z.record(z.unknown()).describe('MBQL query to convert to native SQL'),
});

// Get query duration input schema
export const GetQueryDurationInputSchema = z.object({
  query: z.record(z.unknown()).describe('MBQL query to estimate duration for'),
});

// Format query for visualization input schema
export const FormatQueryForVizInputSchema = z.object({
  query: z.record(z.unknown()).describe('MBQL query to format for visualization'),
});

// Inferred types
export type QueryType = z.infer<typeof QueryTypeSchema>;
export type DatasetQuery = z.infer<typeof DatasetQuerySchema>;
export type ExecuteQueryInput = z.infer<typeof ExecuteQueryInputSchema>;
export type ExportFormat = z.infer<typeof ExportFormatSchema>;
export type ExportQueryInput = z.infer<typeof ExportQueryInputSchema>;
export type ExecutePivotQueryInput = z.infer<typeof ExecutePivotQueryInputSchema>;
export type GetNativeQueryInput = z.infer<typeof GetNativeQueryInputSchema>;
export type GetQueryDurationInput = z.infer<typeof GetQueryDurationInputSchema>;
export type FormatQueryForVizInput = z.infer<typeof FormatQueryForVizInputSchema>;
