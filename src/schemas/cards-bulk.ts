import { z } from 'zod';

// List cards in dashboards input schema
export const ListCardsInDashboardsInputSchema = z.object({
  card_ids: z.array(z.number()).describe('Array of card IDs to look up'),
});

// Bulk move cards input schema
export const BulkMoveCardsInputSchema = z.object({
  card_ids: z.array(z.number()).describe('Array of card IDs to move'),
  collection_id: z.number().nullable().describe('Target collection ID'),
});

// Inferred types
export type ListCardsInDashboardsInput = z.infer<typeof ListCardsInDashboardsInputSchema>;
export type BulkMoveCardsInput = z.infer<typeof BulkMoveCardsInputSchema>;
