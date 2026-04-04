import { z } from 'zod';

// Submit product feedback input schema
export const SubmitProductFeedbackInputSchema = z.object({
  comments: z.string().describe('Feedback comments from the user'),
  source: z.string().describe('Source context where the feedback was submitted'),
  rating: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .describe('Optional rating from 1 (worst) to 5 (best)'),
});

// Inferred types
export type SubmitProductFeedbackInput = z.infer<typeof SubmitProductFeedbackInputSchema>;
