import { z } from 'zod';

export const TranslateEntityIdsInputSchema = z.object({
  entity_ids: z
    .array(
      z.object({
        model: z.string().describe('Model type (e.g., "card", "dashboard", "collection")'),
        id: z.string().describe('Entity ID to translate'),
      }),
    )
    .describe('Array of entity ID references to translate'),
});
export type TranslateEntityIdsInput = z.infer<typeof TranslateEntityIdsInputSchema>;
