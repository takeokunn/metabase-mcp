import { z } from 'zod';

// Submit product feedback input schema
export const SubmitProductFeedbackInputSchema = z.object({
  source: z.string().describe('Source of the feedback'),
  comment: z.string().optional().describe('Feedback comment'),
});

// Inferred types
export type SubmitProductFeedbackInput = z.infer<typeof SubmitProductFeedbackInputSchema>;
