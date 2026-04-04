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
  entity: z.enum(['table', 'segment', 'question', 'field', 'metric']).describe('Entity type'),
  entity_id: z.union([z.number(), z.string()]).describe('Entity ID or query'),
});

// X-ray entity enum (reusable)
const XrayEntityEnum = z
  .enum(['table', 'segment', 'field', 'metric', 'card'])
  .describe('Entity type');

// X-ray entity cell params schema
export const GetXrayEntityCellInputSchema = z.object({
  entity: XrayEntityEnum,
  entity_id_or_query: z.string().describe('Entity ID or query'),
  cell_query: z.string().describe('Cell query'),
});

// X-ray entity cell compare params schema
export const GetXrayEntityCellCompareInputSchema = z.object({
  entity: XrayEntityEnum,
  entity_id_or_query: z.string().describe('Entity ID or query'),
  cell_query: z.string().describe('Cell query'),
  comparison_entity: z.string().describe('Comparison entity type'),
  comparison_entity_id_or_query: z.string().describe('Comparison entity ID or query'),
});

// X-ray entity cell rule params schema
export const GetXrayEntityCellRuleInputSchema = z.object({
  entity: XrayEntityEnum,
  entity_id_or_query: z.string().describe('Entity ID or query'),
  cell_query: z.string().describe('Cell query'),
  prefix: z.string().describe('Rule prefix'),
  dashboard_template: z.string().describe('Dashboard template name'),
});

// X-ray entity cell rule compare params schema
export const GetXrayEntityCellRuleCompareInputSchema = z.object({
  entity: XrayEntityEnum,
  entity_id_or_query: z.string().describe('Entity ID or query'),
  cell_query: z.string().describe('Cell query'),
  prefix: z.string().describe('Rule prefix'),
  dashboard_template: z.string().describe('Dashboard template name'),
  comparison_entity: z.string().describe('Comparison entity type'),
  comparison_entity_id_or_query: z.string().describe('Comparison entity ID or query'),
});

// X-ray entity compare params schema
export const GetXrayEntityCompareInputSchema = z.object({
  entity: XrayEntityEnum,
  entity_id_or_query: z.string().describe('Entity ID or query'),
  comparison_entity: z.string().describe('Comparison entity type'),
  comparison_entity_id_or_query: z.string().describe('Comparison entity ID or query'),
});

// X-ray entity query metadata params schema
export const GetXrayEntityQueryMetadataInputSchema = z.object({
  entity: XrayEntityEnum,
  entity_id_or_query: z.string().describe('Entity ID or query'),
});

// X-ray entity rule params schema
export const GetXrayEntityRuleInputSchema = z.object({
  entity: XrayEntityEnum,
  entity_id_or_query: z.string().describe('Entity ID or query'),
  prefix: z.string().describe('Rule prefix'),
  dashboard_template: z.string().describe('Dashboard template name'),
});

// X-ray entity rule compare params schema
export const GetXrayEntityRuleCompareInputSchema = z.object({
  entity: XrayEntityEnum,
  entity_id_or_query: z.string().describe('Entity ID or query'),
  prefix: z.string().describe('Rule prefix'),
  dashboard_template: z.string().describe('Dashboard template name'),
  comparison_entity: z.string().describe('Comparison entity type'),
  comparison_entity_id_or_query: z.string().describe('Comparison entity ID or query'),
});

// X-ray model index params schema
export const GetXrayModelIndexInputSchema = z.object({
  model_index_id: z.number().describe('Model index ID'),
  pk_id: z.number().describe('Primary key ID'),
});

// Inferred types
export type GetXrayTableParams = z.infer<typeof GetXrayTableParamsSchema>;
export type GetXrayTableCellParams = z.infer<typeof GetXrayTableCellParamsSchema>;
export type GetXrayDatabaseCandidatesParams = z.infer<typeof GetXrayDatabaseCandidatesParamsSchema>;
export type GetXrayEntityInput = z.infer<typeof GetXrayEntityInputSchema>;
export type GetXrayEntityCellInput = z.infer<typeof GetXrayEntityCellInputSchema>;
export type GetXrayEntityCellCompareInput = z.infer<typeof GetXrayEntityCellCompareInputSchema>;
export type GetXrayEntityCellRuleInput = z.infer<typeof GetXrayEntityCellRuleInputSchema>;
export type GetXrayEntityCellRuleCompareInput = z.infer<
  typeof GetXrayEntityCellRuleCompareInputSchema
>;
export type GetXrayEntityCompareInput = z.infer<typeof GetXrayEntityCompareInputSchema>;
export type GetXrayEntityQueryMetadataInput = z.infer<typeof GetXrayEntityQueryMetadataInputSchema>;
export type GetXrayEntityRuleInput = z.infer<typeof GetXrayEntityRuleInputSchema>;
export type GetXrayEntityRuleCompareInput = z.infer<typeof GetXrayEntityRuleCompareInputSchema>;
export type GetXrayModelIndexInput = z.infer<typeof GetXrayModelIndexInputSchema>;
