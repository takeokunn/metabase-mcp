import { z } from 'zod';

export const PreviewEmbedTokenSchema = z.string().describe('Preview embed token');
export const PreviewExportFormatSchema = z
  .enum(['csv', 'json', 'xlsx', 'pdf'])
  .describe('Export format');

export const PreviewEmbedCardParamsSchema = z.object({
  token: PreviewEmbedTokenSchema,
});
export type PreviewEmbedCardParams = z.infer<typeof PreviewEmbedCardParamsSchema>;

export const PreviewEmbedCardQueryParamsSchema = z.object({
  token: PreviewEmbedTokenSchema,
});
export type PreviewEmbedCardQueryParams = z.infer<typeof PreviewEmbedCardQueryParamsSchema>;

export const PreviewEmbedDashboardParamsSchema = z.object({
  token: PreviewEmbedTokenSchema,
});
export type PreviewEmbedDashboardParams = z.infer<typeof PreviewEmbedDashboardParamsSchema>;

export const PreviewEmbedDashboardQueryParamsSchema = z.object({
  token: PreviewEmbedTokenSchema,
  dashcard_id: z.number().int().describe('Dashboard card ID'),
  card_id: z.number().int().positive().describe('Card ID'),
});
export type PreviewEmbedDashboardQueryParams = z.infer<
  typeof PreviewEmbedDashboardQueryParamsSchema
>;

export const PreviewEmbedDashboardParamsValuesSchema = z.object({
  token: PreviewEmbedTokenSchema,
  param_key: z.string().describe('Parameter key slug'),
});
export type PreviewEmbedDashboardParamsValues = z.infer<
  typeof PreviewEmbedDashboardParamsValuesSchema
>;

export const GetPreviewEmbedCardParamValuesSchema = z.object({
  token: z.string().describe('Preview embed token'),
  param_key: z.string(),
});
export type GetPreviewEmbedCardParamValues = z.infer<typeof GetPreviewEmbedCardParamValuesSchema>;

export const SearchPreviewEmbedCardParamValuesSchema = z.object({
  token: z.string(),
  param_key: z.string(),
  query: z.string(),
});
export type SearchPreviewEmbedCardParamValues = z.infer<
  typeof SearchPreviewEmbedCardParamValuesSchema
>;

export const ExportPreviewEmbedCardQuerySchema = z.object({
  token: z.string(),
  export_format: z.enum(['csv', 'json', 'xlsx']).describe('Export format'),
});
export type ExportPreviewEmbedCardQuery = z.infer<typeof ExportPreviewEmbedCardQuerySchema>;

export const GetPreviewEmbedDashboardParamValuesSchema = z.object({
  token: z.string().describe('Preview embed token'),
  param_key: z.string(),
});
export type GetPreviewEmbedDashboardParamValues = z.infer<
  typeof GetPreviewEmbedDashboardParamValuesSchema
>;

export const SearchPreviewEmbedDashboardParamValuesSchema = z.object({
  token: z.string(),
  param_key: z.string(),
  query: z.string(),
});
export type SearchPreviewEmbedDashboardParamValues = z.infer<
  typeof SearchPreviewEmbedDashboardParamValuesSchema
>;

export const RunPreviewEmbedCardPivotQuerySchema = z.object({
  token: z.string(),
});
export type RunPreviewEmbedCardPivotQuery = z.infer<typeof RunPreviewEmbedCardPivotQuerySchema>;

export const RunPreviewEmbedDashboardPivotQuerySchema = z.object({
  token: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
});
export type RunPreviewEmbedDashboardPivotQuery = z.infer<
  typeof RunPreviewEmbedDashboardPivotQuerySchema
>;

export const ExecutePreviewEmbedDashcardActionSchema = z.object({
  token: z.string(),
  dashcard_id: z.number(),
  parameters: z.record(z.string(), z.unknown()).optional(),
});
export type ExecutePreviewEmbedDashcardAction = z.infer<
  typeof ExecutePreviewEmbedDashcardActionSchema
>;

export const GetPreviewEmbedCardParamRemappingSchema = z.object({
  token: z.string().describe('Preview embed token'),
  param_key: z.string().describe('Parameter key'),
});
export type GetPreviewEmbedCardParamRemapping = z.infer<
  typeof GetPreviewEmbedCardParamRemappingSchema
>;

export const GetPreviewEmbedDashboardParamRemappingSchema = z.object({
  token: z.string(),
  param_key: z.string(),
});
export type GetPreviewEmbedDashboardParamRemapping = z.infer<
  typeof GetPreviewEmbedDashboardParamRemappingSchema
>;

export const RunPreviewEmbedDashcardQuerySchema = z.object({
  token: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
});
export type RunPreviewEmbedDashcardQuery = z.infer<typeof RunPreviewEmbedDashcardQuerySchema>;

export const ExportPreviewEmbedDashcardQuerySchema = z.object({
  token: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
  export_format: z.enum(['csv', 'json', 'xlsx']).describe('Export format'),
});
export type ExportPreviewEmbedDashcardQuery = z.infer<typeof ExportPreviewEmbedDashcardQuerySchema>;

export const RunPreviewEmbedDashboardPivotDashcardQuerySchema = z.object({
  token: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
});
export type RunPreviewEmbedDashboardPivotDashcardQuery = z.infer<
  typeof RunPreviewEmbedDashboardPivotDashcardQuerySchema
>;

export const GetPreviewEmbedCardTileSchema = z.object({
  token: z.string(),
  zoom: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GetPreviewEmbedCardTile = z.infer<typeof GetPreviewEmbedCardTileSchema>;

export const GetPreviewEmbedDashboardTileSchema = z.object({
  token: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
  zoom: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GetPreviewEmbedDashboardTile = z.infer<typeof GetPreviewEmbedDashboardTileSchema>;
