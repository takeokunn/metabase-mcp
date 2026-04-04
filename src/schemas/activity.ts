import { z } from 'zod';

export const ListRecentsParamsSchema = z.object({
  context: z.string().optional().describe('Context filter (e.g., "views")'),
});

export type ListRecentsParams = z.infer<typeof ListRecentsParamsSchema>;

export const AddRecentActivityInputSchema = z.object({
  model_type: z.string().describe('Type of model (e.g., card, dashboard)'),
  model_id: z.number().describe('ID of the model'),
});
export type AddRecentActivityInput = z.infer<typeof AddRecentActivityInputSchema>;
