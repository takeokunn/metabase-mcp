import { z } from 'zod';

// Bulk move cards input schema
export const BulkMoveCardsInputSchema = z.object({
  card_ids: z
    .array(z.number().int().positive())
    .describe('Array of card IDs to move'),
  collection_id: z
    .number()
    .int()
    .positive()
    .describe('Target collection ID to move cards into'),
});

// List cards in dashboards input schema
export const ListCardsInDashboardsInputSchema = z.object({
  card_ids: z
    .array(z.number().int().positive())
    .describe('Array of card IDs to find dashboards for'),
});

// Inferred types
export type BulkMoveCardsInput = z.infer<typeof BulkMoveCardsInputSchema>;
export type ListCardsInDashboardsInput = z.infer<typeof ListCardsInDashboardsInputSchema>;
