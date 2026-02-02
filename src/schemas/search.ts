import { z } from 'zod';
import { IdSchema } from './common';

// Search model types enum
export const SearchModelSchema = z.enum([
  'card',
  'dashboard',
  'collection',
  'table',
  'database',
  'action',
  'indexed-entity',
]);

// Search query parameters schema
export const SearchParamsSchema = z.object({
  q: z.string().min(1).describe('Search query string'),
  models: z.array(SearchModelSchema).optional().describe('Filter by model types'),
  limit: z.number().int().positive().optional().describe('Maximum number of results'),
  offset: z.number().int().nonnegative().optional().describe('Offset for pagination'),
  table_db_id: z.number().int().positive().optional().describe('Filter by database ID for tables'),
  collection_id: z.number().int().positive().optional().describe('Filter by collection ID'),
});

// Search result item schema
export const SearchResultSchema = z.object({
  id: IdSchema,
  name: z.string(),
  model: SearchModelSchema,
  description: z.string().nullable().optional(),
  collection: z
    .object({
      id: IdSchema,
      name: z.string(),
    })
    .nullable()
    .optional(),
  database_id: z.number().int().positive().nullable().optional(),
});

// Search response schema
export const SearchResponseSchema = z.object({
  data: z.array(SearchResultSchema),
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
  available_models: z.array(SearchModelSchema).optional(),
});

// Search models response schema (for /api/search/models endpoint)
export const SearchModelsResponseSchema = z.array(SearchModelSchema);

// Inferred types
export type SearchModel = z.infer<typeof SearchModelSchema>;
export type SearchParams = z.infer<typeof SearchParamsSchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type SearchModelsResponse = z.infer<typeof SearchModelsResponseSchema>;
