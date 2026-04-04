import { z } from 'zod';

export const QueryMetabotInputSchema = z.object({
  message: z.string().describe('User message to send to the Metabot agent'),
  context: z.record(z.unknown()).describe('Context object for the conversation'),
});
export type QueryMetabotInput = z.infer<typeof QueryMetabotInputSchema>;

export const FeedbackMetabotInputSchema = z.object({
  feedback_type: z.string().describe('Type of feedback (e.g., "positive", "negative")'),
  conversation_id: z.string().describe('ID of the conversation to provide feedback for'),
});
export type FeedbackMetabotInput = z.infer<typeof FeedbackMetabotInputSchema>;

export const UpdateMetabotSettingsInputSchema = z.object({
  settings: z.record(z.unknown()).describe('Metabot settings key-value pairs to update'),
});
export type UpdateMetabotSettingsInput = z.infer<typeof UpdateMetabotSettingsInputSchema>;
