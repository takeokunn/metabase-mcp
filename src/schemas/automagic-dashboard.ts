import { z } from 'zod';
import { IdSchema } from './common';

// X-ray table params schema
export const GetXrayTableParamsSchema = z.object({
  id: IdSchema.describe('Table ID'),
});

// X-ray table cell params schema
export const GetXrayTableCellParamsSchema = z.object({
  id: IdSchema.describe('Table ID'),
  row_value: z.string().describe('Row value for the cell'),
  prefix: z.string().describe('Rule prefix'),
  rule: z.string().describe('Rule name'),
});

// X-ray database candidates params schema
export const GetXrayDatabaseCandidatesParamsSchema = z.object({
  id: IdSchema.describe('Database ID'),
});

// X-ray card params schema
export const GetXrayCardParamsSchema = z.object({
  id: IdSchema.describe('Card/question ID'),
});

// X-ray segment params schema
export const GetXraySegmentParamsSchema = z.object({
  id: IdSchema.describe('Segment ID'),
});

// X-ray field params schema
export const GetXrayFieldParamsSchema = z.object({
  id: IdSchema.describe('Field ID'),
});

// X-ray metric params schema
export const GetXrayMetricParamsSchema = z.object({
  id: IdSchema.describe('Metric ID'),
});

// Inferred types
export type GetXrayTableParams = z.infer<typeof GetXrayTableParamsSchema>;
export type GetXrayTableCellParams = z.infer<typeof GetXrayTableCellParamsSchema>;
export type GetXrayDatabaseCandidatesParams = z.infer<typeof GetXrayDatabaseCandidatesParamsSchema>;
export type GetXrayCardParams = z.infer<typeof GetXrayCardParamsSchema>;
export type GetXraySegmentParams = z.infer<typeof GetXraySegmentParamsSchema>;
export type GetXrayFieldParams = z.infer<typeof GetXrayFieldParamsSchema>;
export type GetXrayMetricParams = z.infer<typeof GetXrayMetricParamsSchema>;
