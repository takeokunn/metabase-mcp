import { z } from 'zod';
import { IdSchema } from './common';

// Snippet ID schema (positive integer)
export const SnippetIdSchema = IdSchema.describe('Native query snippet ID');

// Snippet schema
export const SnippetSchema = z.object({
  id: SnippetIdSchema,
  name: z.string().min(1).describe('Snippet name'),
  description: z.string().nullable().optional().describe('Snippet description'),
  content: z.string().describe('SQL content of the snippet'),
  creator_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('ID of the user who created the snippet'),
  archived: z.boolean().optional().describe('Whether the snippet is archived'),
  created_at: z.string().datetime().optional().describe('Creation timestamp'),
  updated_at: z.string().datetime().optional().describe('Last update timestamp'),
  collection_id: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe('Collection ID containing the snippet'),
});

// List snippets params schema
export const ListSnippetsParamsSchema = z.object({
  archived: z.boolean().optional().describe('Filter by archived status'),
});

// Get snippet params schema
export const GetSnippetParamsSchema = z.object({
  id: SnippetIdSchema.describe('Snippet ID to retrieve'),
});

// Create snippet input schema
export const CreateSnippetInputSchema = z.object({
  name: z.string().min(1).describe('Snippet display name'),
  content: z.string().min(1).describe('SQL content of the snippet'),
  description: z.string().optional().describe('Snippet description'),
  collection_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Collection ID to save the snippet in'),
});

// Update snippet input schema
export const UpdateSnippetInputSchema = z.object({
  id: SnippetIdSchema.describe('Snippet ID to update'),
  name: z.string().min(1).optional().describe('New snippet display name'),
  content: z.string().min(1).optional().describe('New SQL content of the snippet'),
  description: z.string().nullable().optional().describe('New snippet description'),
  archived: z.boolean().optional().describe('Set archived status'),
  collection_id: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe('Move snippet to a different collection'),
});

// Archive snippet input schema
export const ArchiveSnippetInputSchema = z.object({
  id: SnippetIdSchema.describe('Snippet ID to archive'),
});

// Inferred types
export type SnippetId = z.infer<typeof SnippetIdSchema>;
export type Snippet = z.infer<typeof SnippetSchema>;
export type ListSnippetsParams = z.infer<typeof ListSnippetsParamsSchema>;
export type GetSnippetParams = z.infer<typeof GetSnippetParamsSchema>;
export type CreateSnippetInput = z.infer<typeof CreateSnippetInputSchema>;
export type UpdateSnippetInput = z.infer<typeof UpdateSnippetInputSchema>;
export type ArchiveSnippetInput = z.infer<typeof ArchiveSnippetInputSchema>;
