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
