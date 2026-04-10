import { z } from 'zod';

export const EmbedTokenSchema = z.string().describe('JWT embed token');
export const ExportFormatSchema = z.enum(['csv', 'json', 'xlsx', 'pdf']).describe('Export format');

export const GetEmbedCardParamsSchema = z.object({
  token: EmbedTokenSchema,
});
export type GetEmbedCardParams = z.infer<typeof GetEmbedCardParamsSchema>;

export const GetEmbedCardQueryParamsSchema = z.object({
  token: EmbedTokenSchema,
});
export type GetEmbedCardQueryParams = z.infer<typeof GetEmbedCardQueryParamsSchema>;

export const GetEmbedCardQueryFormatParamsSchema = z.object({
  token: EmbedTokenSchema,
  export_format: ExportFormatSchema,
});
export type GetEmbedCardQueryFormatParams = z.infer<typeof GetEmbedCardQueryFormatParamsSchema>;

export const GetEmbedDashboardParamsSchema = z.object({
  token: EmbedTokenSchema,
});
export type GetEmbedDashboardParams = z.infer<typeof GetEmbedDashboardParamsSchema>;

export const GetEmbedDashboardQueryParamsSchema = z.object({
  token: EmbedTokenSchema,
  dashcard_id: z.number().int().describe('Dashboard card ID'),
  card_id: z.number().int().positive().describe('Card ID'),
});
export type GetEmbedDashboardQueryParams = z.infer<typeof GetEmbedDashboardQueryParamsSchema>;

export const GetEmbedDashboardQueryFormatParamsSchema = z.object({
  token: EmbedTokenSchema,
  dashcard_id: z.number().int().describe('Dashboard card ID'),
  card_id: z.number().int().positive().describe('Card ID'),
  export_format: ExportFormatSchema,
});
export type GetEmbedDashboardQueryFormatParams = z.infer<
  typeof GetEmbedDashboardQueryFormatParamsSchema
>;

export const GetEmbedDashboardParamsValuesSchema = z.object({
  token: EmbedTokenSchema,
  param_key: z.string().describe('Parameter key slug'),
});
export type GetEmbedDashboardParamsValues = z.infer<typeof GetEmbedDashboardParamsValuesSchema>;

export const SearchEmbedDashboardParamsSchema = z.object({
  token: EmbedTokenSchema,
  param_key: z.string().describe('Parameter key slug'),
  search_string: z.string().describe('Search string to filter parameter values'),
});
export type SearchEmbedDashboardParams = z.infer<typeof SearchEmbedDashboardParamsSchema>;

export const GetEmbedCardParamValuesSchema = z.object({
  token: z.string().describe('Embed token'),
  param_key: z.string(),
});
export type GetEmbedCardParamValues = z.infer<typeof GetEmbedCardParamValuesSchema>;

export const SearchEmbedCardParamValuesSchema = z.object({
  token: z.string(),
  param_key: z.string(),
  query: z.string(),
});
export type SearchEmbedCardParamValues = z.infer<typeof SearchEmbedCardParamValuesSchema>;

export const ExportEmbedCardQuerySchema = z.object({
  token: z.string(),
  export_format: z.enum(['csv', 'json', 'xlsx']).describe('Export format'),
});
export type ExportEmbedCardQuery = z.infer<typeof ExportEmbedCardQuerySchema>;

export const GetEmbedDashboardParamValuesSchema = z.object({
  token: z.string().describe('Embed token'),
  param_key: z.string(),
});
export type GetEmbedDashboardParamValues = z.infer<typeof GetEmbedDashboardParamValuesSchema>;

export const SearchEmbedDashboardParamValuesSchema = z.object({
  token: z.string(),
  param_key: z.string(),
  query: z.string(),
});
export type SearchEmbedDashboardParamValues = z.infer<typeof SearchEmbedDashboardParamValuesSchema>;

export const RunEmbedCardPivotQuerySchema = z.object({
  token: z.string(),
});
export type RunEmbedCardPivotQuery = z.infer<typeof RunEmbedCardPivotQuerySchema>;

export const RunEmbedDashboardPivotQuerySchema = z.object({
  token: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
});
export type RunEmbedDashboardPivotQuery = z.infer<typeof RunEmbedDashboardPivotQuerySchema>;

export const ExecuteEmbedDashcardActionSchema = z.object({
  token: z.string(),
  dashcard_id: z.number(),
  parameters: z.record(z.string(), z.unknown()).optional(),
});
export type ExecuteEmbedDashcardAction = z.infer<typeof ExecuteEmbedDashcardActionSchema>;

export const GetEmbedCardParamRemappingSchema = z.object({
  token: z.string().describe('Embed token'),
  param_key: z.string().describe('Parameter key'),
});
export type GetEmbedCardParamRemapping = z.infer<typeof GetEmbedCardParamRemappingSchema>;

export const GetEmbedDashboardParamRemappingSchema = z.object({
  token: z.string(),
  param_key: z.string(),
});
export type GetEmbedDashboardParamRemapping = z.infer<typeof GetEmbedDashboardParamRemappingSchema>;

export const RunEmbedDashcardQuerySchema = z.object({
  token: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
});
export type RunEmbedDashcardQuery = z.infer<typeof RunEmbedDashcardQuerySchema>;

export const ExportEmbedDashcardQuerySchema = z.object({
  token: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
  export_format: z.enum(['csv', 'json', 'xlsx']).describe('Export format'),
});
export type ExportEmbedDashcardQuery = z.infer<typeof ExportEmbedDashcardQuerySchema>;

export const RunEmbedDashboardPivotDashcardQuerySchema = z.object({
  token: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
});
export type RunEmbedDashboardPivotDashcardQuery = z.infer<
  typeof RunEmbedDashboardPivotDashcardQuerySchema
>;

export const GetEmbedCardTileSchema = z.object({
  token: z.string(),
  zoom: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GetEmbedCardTile = z.infer<typeof GetEmbedCardTileSchema>;

export const GetEmbedDashboardTileSchema = z.object({
  token: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
  zoom: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GetEmbedDashboardTile = z.infer<typeof GetEmbedDashboardTileSchema>;
