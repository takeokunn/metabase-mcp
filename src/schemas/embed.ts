import { z } from 'zod';

export const EmbedTokenSchema = z.string().describe('JWT embed token');
export const ExportFormatSchema = z
  .enum(['csv', 'json', 'xlsx', 'pdf'])
  .describe('Export format');

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
