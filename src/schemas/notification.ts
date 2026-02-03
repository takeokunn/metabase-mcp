import { z } from 'zod';
import { IdSchema } from './common';
import { DashboardIdSchema } from './dashboard';

// Notification ID schema
export const NotificationIdSchema = IdSchema;

// Notification channel type schema
export const NotificationChannelTypeSchema = z
  .enum(['email', 'slack'])
  .describe('Notification channel type');

// Schedule type schema
export const ScheduleTypeSchema = z
  .enum(['hourly', 'daily', 'weekly', 'monthly'])
  .describe('Notification schedule frequency');

// Day of week schema
export const DayOfWeekSchema = z
  .enum(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'])
  .describe('Day of the week');

// Notification recipient schema
export const NotificationRecipientSchema = z.object({
  id: z.number().int().positive().optional().describe('User ID'),
  email: z.string().email().optional().describe('Email address'),
});

// Notification channel schema
export const NotificationChannelSchema = z.object({
  channel_type: NotificationChannelTypeSchema.describe('Type of notification channel'),
  enabled: z.boolean().optional().describe('Whether the channel is enabled'),
  recipients: z.array(NotificationRecipientSchema).optional().describe('List of recipients'),
  details: z
    .record(z.unknown())
    .optional()
    .describe('Channel-specific details (e.g., Slack webhook)'),
  schedule_type: ScheduleTypeSchema.optional().describe('Schedule frequency'),
  schedule_hour: z.number().int().min(0).max(23).optional().describe('Hour of day (0-23)'),
  schedule_day: DayOfWeekSchema.nullable().optional().describe('Day of week for weekly schedules'),
  schedule_frame: z
    .enum(['first', 'mid', 'last'])
    .nullable()
    .optional()
    .describe('Frame for monthly schedules'),
});

// Dashboard subscription schema (notification for dashboard)
export const DashboardSubscriptionSchema = z.object({
  id: NotificationIdSchema.describe('Subscription ID'),
  dashboard_id: DashboardIdSchema.describe('Dashboard ID'),
  channels: z.array(NotificationChannelSchema).describe('Notification channels'),
  creator: z
    .object({
      id: z.number().int().positive(),
      email: z.string().email().optional(),
      common_name: z.string().optional(),
    })
    .optional()
    .describe('User who created the subscription'),
  created_at: z.string().datetime().optional().describe('Creation timestamp'),
  updated_at: z.string().datetime().optional().describe('Last update timestamp'),
  archived: z.boolean().optional().describe('Whether the subscription is archived'),
  parameters: z.array(z.record(z.unknown())).optional().describe('Dashboard filter parameters'),
});

// =============================================================================
// Dashboard Subscription Input Schemas
// =============================================================================

// List dashboard subscriptions params schema
export const ListDashboardSubscriptionsParamsSchema = z.object({
  dashboard_id: DashboardIdSchema.optional().describe('Filter by dashboard ID'),
  archived: z.boolean().optional().describe('Include archived subscriptions'),
});

// Get subscription params schema
export const GetDashboardSubscriptionParamsSchema = z.object({
  id: NotificationIdSchema.describe('Subscription ID'),
});

// Create dashboard subscription input schema
export const CreateDashboardSubscriptionInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID to subscribe to'),
  channels: z
    .array(
      z.object({
        channel_type: NotificationChannelTypeSchema.describe('Channel type'),
        enabled: z.boolean().default(true).describe('Whether the channel is enabled'),
        recipients: z.array(NotificationRecipientSchema).optional().describe('Recipients'),
        details: z.record(z.unknown()).optional().describe('Channel-specific details'),
        schedule_type: ScheduleTypeSchema.describe('Schedule frequency'),
        schedule_hour: z.number().int().min(0).max(23).optional().describe('Hour of day'),
        schedule_day: DayOfWeekSchema.nullable().optional().describe('Day of week'),
        schedule_frame: z
          .enum(['first', 'mid', 'last'])
          .nullable()
          .optional()
          .describe('Monthly frame'),
      }),
    )
    .min(1)
    .describe('Notification channels'),
  parameters: z.array(z.record(z.unknown())).optional().describe('Dashboard filter parameters'),
});

// Update dashboard subscription input schema
export const UpdateDashboardSubscriptionInputSchema = z.object({
  id: NotificationIdSchema.describe('Subscription ID to update'),
  channels: z.array(NotificationChannelSchema).optional().describe('Updated notification channels'),
  parameters: z.array(z.record(z.unknown())).optional().describe('Updated filter parameters'),
  archived: z.boolean().optional().describe('Archive or unarchive the subscription'),
});

// Delete dashboard subscription input schema
export const DeleteDashboardSubscriptionInputSchema = z.object({
  id: NotificationIdSchema.describe('Subscription ID to delete'),
});

// =============================================================================
// Inferred Types
// =============================================================================

export type NotificationId = z.infer<typeof NotificationIdSchema>;
export type NotificationChannelType = z.infer<typeof NotificationChannelTypeSchema>;
export type ScheduleType = z.infer<typeof ScheduleTypeSchema>;
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;
export type NotificationRecipient = z.infer<typeof NotificationRecipientSchema>;
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;
export type DashboardSubscription = z.infer<typeof DashboardSubscriptionSchema>;

export type ListDashboardSubscriptionsParams = z.infer<
  typeof ListDashboardSubscriptionsParamsSchema
>;
export type GetDashboardSubscriptionParams = z.infer<typeof GetDashboardSubscriptionParamsSchema>;
export type CreateDashboardSubscriptionInput = z.infer<
  typeof CreateDashboardSubscriptionInputSchema
>;
export type UpdateDashboardSubscriptionInput = z.infer<
  typeof UpdateDashboardSubscriptionInputSchema
>;
export type DeleteDashboardSubscriptionInput = z.infer<
  typeof DeleteDashboardSubscriptionInputSchema
>;
