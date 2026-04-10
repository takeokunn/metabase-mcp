import { z } from 'zod';

export const GetSettingParamsSchema = z.object({
  key: z.string().describe('Setting key (e.g., "site-name", "email-smtp-host")'),
});
export type GetSettingParams = z.infer<typeof GetSettingParamsSchema>;

export const UpdateSettingInputSchema = z.object({
  key: z.string().describe('Setting key to update (e.g., "site-name", "email-smtp-host")'),
  value: z.unknown().describe('New value for the setting'),
});
export type UpdateSettingInput = z.infer<typeof UpdateSettingInputSchema>;

export const BulkUpdateSettingsInputSchema = z.object({
  settings: z
    .record(z.string(), z.unknown())
    .describe('Map of setting keys to their new values (e.g., { "site-name": "Acme Corp" })'),
});
export type BulkUpdateSettingsInput = z.infer<typeof BulkUpdateSettingsInputSchema>;
