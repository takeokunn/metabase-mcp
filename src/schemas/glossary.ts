import { z } from 'zod';
import { IdSchema } from './common';

// Glossary ID schema (positive integer)
export const GlossaryIdSchema = IdSchema;

// Create glossary entry input schema
export const CreateGlossaryEntryInputSchema = z.object({
  name: z.string().describe('Name of the glossary entry'),
  definition: z.string().describe('Definition or description of the glossary entry'),
  synonyms: z.array(z.string()).describe('List of synonyms for the glossary entry').optional(),
  collection_id: z.number().describe('ID of the collection this entry belongs to').optional(),
});

// Update glossary entry input schema
export const UpdateGlossaryEntryInputSchema = z.object({
  id: z.number().describe('Glossary entry ID to update'),
  name: z.string().describe('Updated name of the glossary entry').optional(),
  definition: z.string().describe('Updated definition of the glossary entry').optional(),
  synonyms: z
    .array(z.string())
    .describe('Updated list of synonyms for the glossary entry')
    .optional(),
});

// Delete glossary entry params schema
export const DeleteGlossaryEntryParamsSchema = z.object({
  id: z.number().describe('Glossary entry ID to delete'),
});

// Inferred types
export type GlossaryId = z.infer<typeof GlossaryIdSchema>;
export type CreateGlossaryEntryInput = z.infer<typeof CreateGlossaryEntryInputSchema>;
export type UpdateGlossaryEntryInput = z.infer<typeof UpdateGlossaryEntryInputSchema>;
export type DeleteGlossaryEntryParams = z.infer<typeof DeleteGlossaryEntryParamsSchema>;
