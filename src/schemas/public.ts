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
