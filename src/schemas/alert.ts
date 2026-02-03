import { z } from 'zod';
import { IdSchema } from './common';

// Alert ID schema (positive integer)
export const AlertIdSchema = IdSchema;

// Alert condition enum
export const AlertConditionSchema = z.enum(['rows', 'goal']).describe('Alert trigger condition');

// Channel type schema for alerts
export const AlertChannelSchema = z.object({
  channel_type: z.enum(['email', 'slack']).describe('Type of notification channel'),
  enabled: z.boolean().optional().describe('Whether the channel is enabled'),
  recipients: z
    .array(
      z.object({
        id: z.number().int().positive().optional(),
        email: z.string().email().optional(),
      }),
    )
    .optional()
    .describe('List of recipients for the alert'),
  details: z.record(z.unknown()).optional().describe('Channel-specific details'),
  schedule_type: z
    .enum(['hourly', 'daily', 'weekly'])
    .optional()
    .describe('How often to check the alert'),
  schedule_hour: z.number().int().min(0).max(23).optional().describe('Hour of day to check (0-23)'),
  schedule_day: z
    .enum(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'])
    .nullable()
    .optional()
    .describe('Day of week to check'),
});

// Alert schema
export const AlertSchema = z.object({
  id: AlertIdSchema.describe('Unique identifier for the alert'),
  card: z
    .object({
      id: z.number().int().positive(),
      name: z.string().optional(),
      include_csv: z.boolean().optional(),
      include_xls: z.boolean().optional(),
    })
    .describe('Card (question) associated with the alert'),
  channels: z.array(AlertChannelSchema).describe('Notification channels for the alert'),
  alert_condition: AlertConditionSchema.describe('Condition that triggers the alert'),
  alert_first_only: z
    .boolean()
    .describe('Whether to alert only the first time the condition is met'),
  alert_above_goal: z
    .boolean()
    .nullable()
    .optional()
    .describe('For goal alerts, whether to trigger when above goal'),
  creator: z
    .object({
      id: z.number().int().positive(),
      email: z.string().email().optional(),
      common_name: z.string().optional(),
    })
    .optional()
    .describe('User who created the alert'),
  created_at: z.string().datetime().optional().describe('Timestamp when the alert was created'),
  updated_at: z
    .string()
    .datetime()
    .optional()
    .describe('Timestamp when the alert was last updated'),
  archived: z.boolean().optional().describe('Whether the alert is archived'),
});

// List alerts params schema
export const ListAlertsParamsSchema = z.object({
  card_id: z.number().int().positive().optional().describe('Filter alerts by card ID'),
});

// Get alert params schema
export const GetAlertParamsSchema = z.object({
  id: AlertIdSchema.describe('Alert ID'),
});

// Create alert input schema
export const CreateAlertInputSchema = z.object({
  card: z
    .object({
      id: z.number().int().positive().describe('Card ID to create alert for'),
      include_csv: z.boolean().optional().describe('Include CSV attachment'),
      include_xls: z.boolean().optional().describe('Include XLS attachment'),
    })
    .describe('Card configuration for the alert'),
  alert_condition: AlertConditionSchema.describe('Condition that triggers the alert'),
  alert_first_only: z
    .boolean()
    .default(true)
    .describe('Whether to alert only the first time the condition is met'),
  alert_above_goal: z
    .boolean()
    .nullable()
    .optional()
    .describe('For goal alerts, whether to trigger when above goal'),
  channels: z.array(AlertChannelSchema).optional().describe('Notification channels for the alert'),
});

// Update alert input schema
export const UpdateAlertInputSchema = z.object({
  id: AlertIdSchema.describe('Alert ID to update'),
  card: z
    .object({
      id: z.number().int().positive().optional(),
      include_csv: z.boolean().optional(),
      include_xls: z.boolean().optional(),
    })
    .optional()
    .describe('Updated card configuration'),
  alert_condition: AlertConditionSchema.optional().describe('Updated alert condition'),
  alert_first_only: z.boolean().optional().describe('Updated first-only setting'),
  alert_above_goal: z.boolean().nullable().optional().describe('Updated above-goal setting'),
  channels: z.array(AlertChannelSchema).optional().describe('Updated notification channels'),
  archived: z.boolean().optional().describe('Archive or unarchive the alert'),
});

// Delete alert input schema
export const DeleteAlertInputSchema = z.object({
  id: AlertIdSchema.describe('Alert ID to delete'),
});

// Inferred types
export type AlertId = z.infer<typeof AlertIdSchema>;
export type AlertCondition = z.infer<typeof AlertConditionSchema>;
export type AlertChannel = z.infer<typeof AlertChannelSchema>;
export type Alert = z.infer<typeof AlertSchema>;
export type ListAlertsParams = z.infer<typeof ListAlertsParamsSchema>;
export type GetAlertParams = z.infer<typeof GetAlertParamsSchema>;
export type CreateAlertInput = z.infer<typeof CreateAlertInputSchema>;
export type UpdateAlertInput = z.infer<typeof UpdateAlertInputSchema>;
export type DeleteAlertInput = z.infer<typeof DeleteAlertInputSchema>;
