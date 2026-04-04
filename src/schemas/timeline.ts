import { z } from 'zod';
import { IdSchema } from './common';

export const TimelineIdSchema = IdSchema;
export const TimelineEventIdSchema = IdSchema;

// List timelines params schema
export const ListTimelinesParamsSchema = z.object({
  include: z.string().optional().describe('What to include (e.g., "events")'),
  archived: z.boolean().optional().describe('Whether to include archived timelines'),
});

// Get timeline params schema
export const GetTimelineParamsSchema = z.object({
  id: IdSchema.describe('ID of the timeline'),
  include: z.string().optional().describe('What to include (e.g., "events")'),
  start: z.string().optional().describe('Start date for filtering events'),
  end: z.string().optional().describe('End date for filtering events'),
});

// Create timeline input schema
export const CreateTimelineInputSchema = z.object({
  name: z.string().describe('Name of the timeline'),
  collection_id: z
    .number()
    .int()
    .positive()
    .describe('ID of the collection to create the timeline in'),
  description: z.string().optional().describe('Description of the timeline'),
  icon: z.string().optional().describe('Icon for the timeline'),
  archived: z.boolean().optional().describe('Whether the timeline is archived'),
});

// Update timeline input schema
export const UpdateTimelineInputSchema = z.object({
  id: IdSchema.describe('ID of the timeline to update'),
  name: z.string().optional().describe('Name of the timeline'),
  description: z.string().optional().describe('Description of the timeline'),
  icon: z.string().optional().describe('Icon for the timeline'),
  archived: z.boolean().optional().describe('Whether the timeline is archived'),
  collection_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('ID of the collection for the timeline'),
});

// Delete timeline params schema
export const DeleteTimelineParamsSchema = z.object({
  id: IdSchema.describe('ID of the timeline to delete'),
});

// Get collection timelines params schema
export const GetCollectionTimelinesParamsSchema = z.object({
  id: IdSchema.describe('ID of the collection'),
  include: z.string().optional().describe('What to include (e.g., "events")'),
  archived: z.boolean().optional().describe('Whether to include archived timelines'),
});

// Get collection root timelines params schema (no id needed)
export const GetCollectionRootTimelinesParamsSchema = z.object({
  include: z.string().optional().describe('What to include (e.g., "events")'),
  archived: z.boolean().optional().describe('Whether to include archived timelines'),
});

// Create timeline event input schema
export const CreateTimelineEventInputSchema = z.object({
  name: z.string().describe('Name of the timeline event'),
  timeline_id: z.number().int().positive().describe('ID of the timeline this event belongs to'),
  timestamp: z.string().describe('Timestamp of the event (ISO 8601 format)'),
  description: z.string().optional().describe('Description of the timeline event'),
  icon: z.string().optional().describe('Icon for the timeline event'),
  time_matters: z.boolean().optional().describe('Whether the time of day matters for this event'),
  timezone: z.string().optional().describe('Timezone for the event timestamp'),
  archived: z.boolean().optional().describe('Whether the timeline event is archived'),
});

// Get timeline event params schema
export const GetTimelineEventParamsSchema = z.object({
  id: IdSchema.describe('ID of the timeline event'),
});

// Update timeline event input schema
export const UpdateTimelineEventInputSchema = z.object({
  id: IdSchema.describe('ID of the timeline event to update'),
  name: z.string().optional().describe('Name of the timeline event'),
  description: z.string().optional().describe('Description of the timeline event'),
  timestamp: z.string().optional().describe('Timestamp of the event (ISO 8601 format)'),
  icon: z.string().optional().describe('Icon for the timeline event'),
  timeline_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('ID of the timeline this event belongs to'),
  time_matters: z.boolean().optional().describe('Whether the time of day matters for this event'),
  timezone: z.string().optional().describe('Timezone for the event timestamp'),
  archived: z.boolean().optional().describe('Whether the timeline event is archived'),
});

// Delete timeline event params schema
export const DeleteTimelineEventParamsSchema = z.object({
  id: IdSchema.describe('ID of the timeline event to delete'),
});

// Inferred types
export type ListTimelinesParams = z.infer<typeof ListTimelinesParamsSchema>;
export type GetTimelineParams = z.infer<typeof GetTimelineParamsSchema>;
export type CreateTimelineInput = z.infer<typeof CreateTimelineInputSchema>;
export type UpdateTimelineInput = z.infer<typeof UpdateTimelineInputSchema>;
export type DeleteTimelineParams = z.infer<typeof DeleteTimelineParamsSchema>;
export type GetCollectionTimelinesParams = z.infer<typeof GetCollectionTimelinesParamsSchema>;
export type GetCollectionRootTimelinesParams = z.infer<
  typeof GetCollectionRootTimelinesParamsSchema
>;
export type CreateTimelineEventInput = z.infer<typeof CreateTimelineEventInputSchema>;
export type GetTimelineEventParams = z.infer<typeof GetTimelineEventParamsSchema>;
export type UpdateTimelineEventInput = z.infer<typeof UpdateTimelineEventInputSchema>;
export type DeleteTimelineEventParams = z.infer<typeof DeleteTimelineEventParamsSchema>;
