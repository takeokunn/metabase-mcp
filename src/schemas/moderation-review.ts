import { z } from 'zod';

export const CreateModerationReviewInputSchema = z.object({
  moderated_item_id: z.number().int().positive().describe('ID of the item being reviewed'),
  moderated_item_type: z.string().describe('Type of the item being reviewed (e.g., "card", "dashboard")'),
  status: z.string().nullable().describe('Moderation status to set (e.g., "verified", "blocked", or null to remove)'),
  text: z.string().nullable().describe('Optional text comment for the moderation review'),
});
export type CreateModerationReviewInput = z.infer<typeof CreateModerationReviewInputSchema>;
