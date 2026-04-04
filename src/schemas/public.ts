import { z } from 'zod';

export const PublicUUIDSchema = z.string().uuid().describe('Public sharing UUID');
export const PublicExportFormatSchema = z
  .enum(['csv', 'json', 'xlsx', 'pdf'])
  .describe('Export format');

export const GetPublicCardParamsSchema = z.object({
  uuid: PublicUUIDSchema,
});
export type GetPublicCardParams = z.infer<typeof GetPublicCardParamsSchema>;

export const GetPublicCardQueryParamsSchema = z.object({
  uuid: PublicUUIDSchema,
});
export type GetPublicCardQueryParams = z.infer<typeof GetPublicCardQueryParamsSchema>;

export const GetPublicCardQueryFormatParamsSchema = z.object({
  uuid: PublicUUIDSchema,
  export_format: PublicExportFormatSchema,
});
export type GetPublicCardQueryFormatParams = z.infer<typeof GetPublicCardQueryFormatParamsSchema>;

export const GetPublicDashboardParamsSchema = z.object({
  uuid: PublicUUIDSchema,
});
export type GetPublicDashboardParams = z.infer<typeof GetPublicDashboardParamsSchema>;

export const GetPublicDashboardQueryParamsSchema = z.object({
  uuid: PublicUUIDSchema,
  dashcard_id: z.number().int().describe('Dashboard card ID'),
  card_id: z.number().int().positive().describe('Card ID'),
});
export type GetPublicDashboardQueryParams = z.infer<typeof GetPublicDashboardQueryParamsSchema>;

export const GetPublicDashboardQueryFormatParamsSchema = z.object({
  uuid: PublicUUIDSchema,
  dashcard_id: z.number().int().describe('Dashboard card ID'),
  card_id: z.number().int().positive().describe('Card ID'),
  export_format: PublicExportFormatSchema,
});
export type GetPublicDashboardQueryFormatParams = z.infer<
  typeof GetPublicDashboardQueryFormatParamsSchema
>;

export const GetPublicDashboardParamsValuesSchema = z.object({
  uuid: PublicUUIDSchema,
  param_key: z.string().describe('Parameter key slug'),
});
export type GetPublicDashboardParamsValues = z.infer<typeof GetPublicDashboardParamsValuesSchema>;

export const SearchPublicDashboardParamsSchema = z.object({
  uuid: PublicUUIDSchema,
  param_key: z.string().describe('Parameter key slug'),
  search_string: z.string().describe('Search string to filter parameter values'),
});
export type SearchPublicDashboardParams = z.infer<typeof SearchPublicDashboardParamsSchema>;

export const GetPublicCardParamValuesSchema = z.object({
  uuid: z.string().describe('Public UUID of the card'),
  param_key: z.string().describe('Parameter key'),
});
export type GetPublicCardParamValues = z.infer<typeof GetPublicCardParamValuesSchema>;

export const SearchPublicCardParamValuesSchema = z.object({
  uuid: z.string(),
  param_key: z.string(),
  query: z.string().describe('Search query'),
});
export type SearchPublicCardParamValues = z.infer<typeof SearchPublicCardParamValuesSchema>;

export const GetPublicCardParamRemappingSchema = z.object({
  uuid: z.string(),
  param_key: z.string(),
});
export type GetPublicCardParamRemapping = z.infer<typeof GetPublicCardParamRemappingSchema>;

export const GetPublicDashboardParamValuesSchema = z.object({
  uuid: z.string().describe('Public UUID of the dashboard'),
  param_key: z.string().describe('Parameter key'),
});
export type GetPublicDashboardParamValues = z.infer<typeof GetPublicDashboardParamValuesSchema>;

export const SearchPublicDashboardParamValuesSchema = z.object({
  uuid: z.string(),
  param_key: z.string(),
  query: z.string(),
});
export type SearchPublicDashboardParamValues = z.infer<typeof SearchPublicDashboardParamValuesSchema>;

export const GetPublicDashboardParamRemappingSchema = z.object({
  uuid: z.string(),
  param_key: z.string(),
});
export type GetPublicDashboardParamRemapping = z.infer<typeof GetPublicDashboardParamRemappingSchema>;

export const ExecutePublicActionSchema = z.object({
  uuid: z.string().describe('Public UUID of the action'),
  parameters: z.record(z.unknown()).optional().describe('Action parameters'),
});
export type ExecutePublicAction = z.infer<typeof ExecutePublicActionSchema>;

export const ExecutePublicDashcardActionSchema = z.object({
  uuid: z.string(),
  dashcard_id: z.number(),
  parameters: z.record(z.unknown()).optional(),
});
export type ExecutePublicDashcardAction = z.infer<typeof ExecutePublicDashcardActionSchema>;

export const RunPublicCardPivotQuerySchema = z.object({
  uuid: z.string(),
  parameters: z.array(z.record(z.unknown())).optional(),
});
export type RunPublicCardPivotQuery = z.infer<typeof RunPublicCardPivotQuerySchema>;

export const RunPublicDashboardPivotQuerySchema = z.object({
  uuid: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
  parameters: z.array(z.record(z.unknown())).optional(),
});
export type RunPublicDashboardPivotQuery = z.infer<typeof RunPublicDashboardPivotQuerySchema>;

export const GetPublicOembedSchema = z.object({
  url: z.string().describe('URL of the Metabase resource'),
  maxheight: z.number().optional(),
  maxwidth: z.number().optional(),
});
export type GetPublicOembed = z.infer<typeof GetPublicOembedSchema>;

export const RunPublicDashcardQuerySchema = z.object({
  uuid: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
  parameters: z.array(z.record(z.unknown())).optional(),
});
export type RunPublicDashcardQuery = z.infer<typeof RunPublicDashcardQuerySchema>;

export const GetPublicActionSchema = z.object({
  uuid: z.string().describe('Public UUID of the action'),
});
export type GetPublicAction = z.infer<typeof GetPublicActionSchema>;

export const ExportPublicCardQuerySchema = z.object({
  uuid: z.string(),
  export_format: z.enum(['csv', 'json', 'xlsx']).describe('Export format'),
});
export type ExportPublicCardQuery = z.infer<typeof ExportPublicCardQuerySchema>;

export const GetPublicDashcardQuerySchema = z.object({
  uuid: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
});
export type GetPublicDashcardQuery = z.infer<typeof GetPublicDashcardQuerySchema>;

export const ExportPublicDashcardQuerySchema = z.object({
  uuid: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
  export_format: z.enum(['csv', 'json', 'xlsx']).describe('Export format'),
});
export type ExportPublicDashcardQuery = z.infer<typeof ExportPublicDashcardQuerySchema>;

export const RunPublicDashboardPivotDashcardQuerySchema = z.object({
  uuid: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
});
export type RunPublicDashboardPivotDashcardQuery = z.infer<typeof RunPublicDashboardPivotDashcardQuerySchema>;

export const GetPublicCardTileSchema = z.object({
  uuid: z.string(),
  zoom: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GetPublicCardTile = z.infer<typeof GetPublicCardTileSchema>;

export const GetPublicDashboardTileSchema = z.object({
  uuid: z.string(),
  dashcard_id: z.number(),
  card_id: z.number(),
  zoom: z.number(),
  x: z.number(),
  y: z.number(),
});
export type GetPublicDashboardTile = z.infer<typeof GetPublicDashboardTileSchema>;

export const GetPublicDocumentSchema = z.object({
  uuid: z.string().describe('Public UUID of the document'),
});
export type GetPublicDocument = z.infer<typeof GetPublicDocumentSchema>;

export const GetPublicDocumentCardSchema = z.object({
  uuid: z.string().describe('Public UUID of the document'),
  card_id: z.number().describe('Card ID'),
});
export type GetPublicDocumentCard = z.infer<typeof GetPublicDocumentCardSchema>;

export const ExportPublicDocumentCardSchema = z.object({
  uuid: z.string().describe('Public UUID of the document'),
  card_id: z.number().describe('Card ID'),
  export_format: z.string().describe('Export format'),
});
export type ExportPublicDocumentCard = z.infer<typeof ExportPublicDocumentCardSchema>;

export const ExportPublicDashcardQueryFormatSchema = z.object({
  uuid: z.string().describe('Public UUID of the dashboard'),
  dashcard_id: z.number().describe('Dashboard card ID'),
  card_id: z.number().describe('Card ID'),
  export_format: z.string().describe('Export format'),
});
export type ExportPublicDashcardQueryFormat = z.infer<typeof ExportPublicDashcardQueryFormatSchema>;
