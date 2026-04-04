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

// X-ray generic entity params schema
export const GetXrayEntityInputSchema = z.object({
  entity: z
    .enum(['table', 'segment', 'question', 'field', 'metric'])
    .describe('Entity type'),
  entity_id: z.union([z.number(), z.string()]).describe('Entity ID or query'),
});

// Inferred types
export type GetXrayTableParams = z.infer<typeof GetXrayTableParamsSchema>;
export type GetXrayTableCellParams = z.infer<typeof GetXrayTableCellParamsSchema>;
export type GetXrayDatabaseCandidatesParams = z.infer<typeof GetXrayDatabaseCandidatesParamsSchema>;
export type GetXrayEntityInput = z.infer<typeof GetXrayEntityInputSchema>;
