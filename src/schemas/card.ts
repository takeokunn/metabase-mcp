import { z } from 'zod';
import { IdSchema } from './common';

// Card ID schema (positive integer)
export const CardIdSchema = IdSchema;

// Card display type enum
export const CardDisplayTypeSchema = z.enum([
  'table',
  'bar',
  'line',
  'area',
  'row',
  'pie',
  'scalar',
  'progress',
  'gauge',
  'funnel',
  'scatter',
  'waterfall',
  'combo',
  'pivot',
  'smartscalar',
  'map',
]);

// Card schema
export const CardSchema = z.object({
  id: CardIdSchema,
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  display: CardDisplayTypeSchema,
  database_id: z.number().int().positive(),
  collection_id: z.number().int().positive().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// List cards params schema
export const ListCardsParamsSchema = z.object({
  collection_id: z.number().int().positive().optional().describe('Filter by collection ID'),
});

// Get card params schema
export const GetCardParamsSchema = z.object({
  id: CardIdSchema.describe('Card ID'),
});

// Create card input schema
export const CreateCardInputSchema = z.object({
  name: z.string().min(1).describe('Card display name'),
  display: CardDisplayTypeSchema.describe('Visualization type (e.g., table, bar, line)'),
  dataset_query: z.record(z.unknown()).describe('Query definition in MBQL or native format'),
  visualization_settings: z.record(z.unknown()).optional().describe('Chart visualization settings'),
  collection_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Collection ID to save the card in'),
});

// Update card input schema
export const UpdateCardInputSchema = z.object({
  id: CardIdSchema.describe('Card ID to update'),
  name: z.string().min(1).optional().describe('New card display name'),
  description: z.string().nullable().optional().describe('Card description'),
  display: CardDisplayTypeSchema.optional().describe('New visualization type'),
  dataset_query: z.record(z.unknown()).optional().describe('Updated query definition'),
  visualization_settings: z
    .record(z.unknown())
    .optional()
    .describe('Updated visualization settings'),
  collection_id: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe('Move card to a different collection'),
});

// Delete card input schema
export const DeleteCardInputSchema = z.object({
  id: CardIdSchema.describe('Card ID to delete'),
});

// Execute card params schema
export const ExecuteCardParamsSchema = z.object({
  id: CardIdSchema.describe('Card ID to execute'),
  parameters: z.record(z.unknown()).optional().describe('Query parameters for the card'),
});

// Card metadata params schema
export const GetCardMetadataParamsSchema = z.object({
  id: CardIdSchema.describe('Card ID to get metadata for'),
});

// Inferred types
export type CardId = z.infer<typeof CardIdSchema>;
export type CardDisplayType = z.infer<typeof CardDisplayTypeSchema>;
export type Card = z.infer<typeof CardSchema>;
export type ListCardsParams = z.infer<typeof ListCardsParamsSchema>;
export type GetCardParams = z.infer<typeof GetCardParamsSchema>;
export type CreateCardInput = z.infer<typeof CreateCardInputSchema>;
export type UpdateCardInput = z.infer<typeof UpdateCardInputSchema>;
export type DeleteCardInput = z.infer<typeof DeleteCardInputSchema>;
export type ExecuteCardParams = z.infer<typeof ExecuteCardParamsSchema>;
export type GetCardMetadataParams = z.infer<typeof GetCardMetadataParamsSchema>;

// ---------------------------------------------------------------------------
// Public Link Schemas
// ---------------------------------------------------------------------------

// Create card public link input schema
export const CreateCardPublicLinkInputSchema = z.object({
  id: CardIdSchema.describe('Card ID to create a public link for'),
});

// Delete card public link input schema
export const DeleteCardPublicLinkInputSchema = z.object({
  id: CardIdSchema.describe('Card ID to remove the public link from'),
});

// List embeddable cards params schema (admin only)
export const ListEmbeddableCardsParamsSchema = z.object({});

// List public cards params schema (admin only)
export const ListPublicCardsParamsSchema = z.object({});

// ---------------------------------------------------------------------------
// Copy & Series Schemas
// ---------------------------------------------------------------------------

// Copy card params schema
export const CopyCardParamsSchema = z.object({
  id: CardIdSchema.describe('Card ID to copy'),
  collection_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Collection ID to save the copied card in'),
  name: z.string().optional().describe('Name for the copied card'),
});

// Get card series params schema
export const GetCardSeriesParamsSchema = z.object({
  id: CardIdSchema.describe('Card ID to get related series for'),
});

// Get card related params schema
export const GetCardRelatedParamsSchema = z.object({
  id: CardIdSchema.describe('Card ID to get related items for'),
});

// ---------------------------------------------------------------------------
// Param & Field Value Schemas
// ---------------------------------------------------------------------------

// Get card param values params schema
export const GetCardParamValuesParamsSchema = z.object({
  id: CardIdSchema.describe('Card ID'),
  param_key: z.string().describe('Parameter key (slug) to retrieve values for'),
});

// Search card param values params schema
export const SearchCardParamValuesParamsSchema = z.object({
  id: CardIdSchema.describe('Card ID'),
  param_key: z.string().describe('Parameter key (slug) to search values for'),
  query: z.string().describe('Search query string to filter parameter values'),
});

// Get card field values params schema
export const GetCardFieldValuesParamsSchema = z.object({
  id: CardIdSchema.describe('Card ID'),
  field_id: z.number().int().positive().describe('Field ID to retrieve values for'),
});

// Search card field values params schema
export const SearchCardFieldValuesParamsSchema = z.object({
  id: CardIdSchema.describe('Card ID'),
  field_id: z.number().int().positive().describe('Field ID to search values for'),
  search_value: z.string().describe('Search string to filter field values'),
});

// Export card query params schema
export const ExportCardQueryParamsSchema = z.object({
  id: CardIdSchema.describe('Card ID to export'),
  export_format: z
    .enum(['csv', 'json', 'xlsx', 'pdf'])
    .describe('Export format: csv, json, xlsx, or pdf'),
});

// Execute card pivot params schema
export const ExecuteCardPivotParamsSchema = z.object({
  id: CardIdSchema.describe('Card ID to execute as a pivot table'),
  parameters: z
    .array(z.record(z.unknown()))
    .optional()
    .describe('Query parameters to apply to the pivot query'),
});

// Inferred types - Public Links
export type CreateCardPublicLinkInput = z.infer<typeof CreateCardPublicLinkInputSchema>;
export type DeleteCardPublicLinkInput = z.infer<typeof DeleteCardPublicLinkInputSchema>;
export type ListEmbeddableCardsParams = z.infer<typeof ListEmbeddableCardsParamsSchema>;
export type ListPublicCardsParams = z.infer<typeof ListPublicCardsParamsSchema>;

// Inferred types - Copy & Series
export type CopyCardParams = z.infer<typeof CopyCardParamsSchema>;
export type GetCardSeriesParams = z.infer<typeof GetCardSeriesParamsSchema>;
export type GetCardRelatedParams = z.infer<typeof GetCardRelatedParamsSchema>;

// Inferred types - Param & Field Values
export type GetCardParamValuesParams = z.infer<typeof GetCardParamValuesParamsSchema>;
export type SearchCardParamValuesParams = z.infer<typeof SearchCardParamValuesParamsSchema>;
export type GetCardFieldValuesParams = z.infer<typeof GetCardFieldValuesParamsSchema>;
export type SearchCardFieldValuesParams = z.infer<typeof SearchCardFieldValuesParamsSchema>;
export type ExportCardQueryParams = z.infer<typeof ExportCardQueryParamsSchema>;
export type ExecuteCardPivotParams = z.infer<typeof ExecuteCardPivotParamsSchema>;
