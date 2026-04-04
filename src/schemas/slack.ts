import { z } from 'zod';

// Update Slack settings input schema
export const UpdateSlackSettingsInputSchema = z.object({
  'slack-token': z.string().optional().describe('Slack bot token for integration'),
  'slack-app-token': z.string().optional().describe('Slack app-level token'),
  'slack-files-channel': z.string().optional().describe('Slack channel for file uploads'),
});

// Inferred types
export type UpdateSlackSettingsInput = z.infer<typeof UpdateSlackSettingsInputSchema>;
