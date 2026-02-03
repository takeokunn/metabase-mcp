import { z } from 'zod';
import { IdSchema } from './common';

// Segment ID schema (positive integer)
export const SegmentIdSchema = IdSchema;

// Segment schema
export const SegmentSchema = z.object({
  id: SegmentIdSchema.describe('Unique identifier for the segment'),
  name: z.string().min(1).describe('Display name of the segment'),
  description: z.string().nullable().optional().describe('Description of the segment'),
  table_id: z.number().int().positive().describe('ID of the table this segment belongs to'),
  definition: z.record(z.unknown()).describe('Segment filter definition in MBQL format'),
  archived: z.boolean().describe('Whether the segment is archived'),
  creator_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('ID of the user who created the segment'),
  created_at: z.string().datetime().optional().describe('Timestamp when the segment was created'),
  updated_at: z
    .string()
    .datetime()
    .optional()
    .describe('Timestamp when the segment was last updated'),
});

// List segments params schema
export const ListSegmentsParamsSchema = z.object({}).describe('Parameters for listing segments');

// Get segment params schema
export const GetSegmentParamsSchema = z.object({
  id: SegmentIdSchema.describe('Segment ID'),
});

// Create segment input schema
export const CreateSegmentInputSchema = z.object({
  name: z.string().min(1).describe('Display name for the segment'),
  table_id: z.number().int().positive().describe('ID of the table this segment belongs to'),
  definition: z.record(z.unknown()).describe('Segment filter definition in MBQL format'),
  description: z.string().optional().describe('Description of the segment'),
});

// Update segment input schema
export const UpdateSegmentInputSchema = z.object({
  id: SegmentIdSchema.describe('Segment ID to update'),
  revision_message: z.string().min(1).describe('Message describing the reason for the update'),
  name: z.string().min(1).optional().describe('New display name for the segment'),
  definition: z.record(z.unknown()).optional().describe('Updated segment filter definition'),
  archived: z.boolean().optional().describe('Whether to archive/unarchive the segment'),
});

// Delete segment input schema
export const DeleteSegmentInputSchema = z.object({
  id: SegmentIdSchema.describe('Segment ID to delete'),
  revision_message: z.string().optional().describe('Message describing the reason for deletion'),
});

// Get segment revisions params schema
export const GetSegmentRevisionsParamsSchema = z.object({
  id: SegmentIdSchema.describe('Segment ID to get revisions for'),
});

// Inferred types
export type SegmentId = z.infer<typeof SegmentIdSchema>;
export type Segment = z.infer<typeof SegmentSchema>;
export type ListSegmentsParams = z.infer<typeof ListSegmentsParamsSchema>;
export type GetSegmentParams = z.infer<typeof GetSegmentParamsSchema>;
export type CreateSegmentInput = z.infer<typeof CreateSegmentInputSchema>;
export type UpdateSegmentInput = z.infer<typeof UpdateSegmentInputSchema>;
export type DeleteSegmentInput = z.infer<typeof DeleteSegmentInputSchema>;
export type GetSegmentRevisionsParams = z.infer<typeof GetSegmentRevisionsParamsSchema>;
