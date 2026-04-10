import { z } from 'zod';
import { IdSchema } from './common';

// Channel ID schema (positive integer)
export const ChannelIdSchema = IdSchema;

// Channel type schema
export const ChannelTypeSchema = z
  .string()
  .describe('Type of notification channel (e.g. http, slack)');

// Get channel params schema
export const GetChannelParamsSchema = z.object({
  id: z.number().int().positive().describe('Channel ID'),
});

// Create channel input schema
export const CreateChannelInputSchema = z.object({
  name: z.string().describe('Name of the notification channel'),
  type: ChannelTypeSchema,
  details: z.record(z.string(), z.unknown()).describe('Channel-specific configuration details'),
  description: z.string().optional().describe('Optional description of the channel'),
  active: z.boolean().optional().describe('Whether the channel is active'),
});

// Update channel input schema
export const UpdateChannelInputSchema = z.object({
  id: z.number().int().positive().describe('Channel ID to update'),
  name: z.string().optional().describe('Updated name of the notification channel'),
  type: ChannelTypeSchema.optional(),
  details: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Updated channel-specific configuration details'),
  description: z.string().optional().describe('Updated description of the channel'),
  active: z.boolean().optional().describe('Updated active status of the channel'),
});

// Test channel input schema
export const TestChannelInputSchema = z.object({
  details: z
    .record(z.string(), z.unknown())
    .describe('Channel-specific configuration details to test'),
  type: z.string().describe('Type of notification channel to test'),
});

// Inferred types
export type ChannelId = z.infer<typeof ChannelIdSchema>;
export type ChannelType = z.infer<typeof ChannelTypeSchema>;
export type GetChannelParams = z.infer<typeof GetChannelParamsSchema>;
export type CreateChannelInput = z.infer<typeof CreateChannelInputSchema>;
export type UpdateChannelInput = z.infer<typeof UpdateChannelInputSchema>;
export type TestChannelInput = z.infer<typeof TestChannelInputSchema>;
