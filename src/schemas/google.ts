import { z } from 'zod';

// Update Google settings input schema
export const UpdateGoogleSettingsInputSchema = z.object({
  'google-auth-client-id': z.string().optional().describe('Google OAuth client ID'),
  'google-auth-auto-create-accounts-domain': z
    .string()
    .optional()
    .describe('Domain for auto-creating accounts via Google auth'),
});

// Inferred types
export type UpdateGoogleSettingsInput = z.infer<typeof UpdateGoogleSettingsInputSchema>;
