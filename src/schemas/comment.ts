import { z } from 'zod';
import { IdSchema } from './common';

// Comment ID schema (positive integer)
export const CommentIdSchema = IdSchema;

// List comments params schema
export const ListCommentsParamsSchema = z.object({
  model: z.string().describe('Model type (e.g., "card", "dashboard")').optional(),
  model_id: z.number().int().positive().describe('ID of the model to filter comments by').optional(),
});

// Create comment input schema
export const CreateCommentInputSchema = z.object({
  text: z.string().describe('Text content of the comment'),
  model: z.string().describe('Model type the comment belongs to (e.g., "card", "dashboard")'),
  model_id: z.number().int().positive().describe('ID of the model the comment belongs to'),
  mentioned_users: z.array(z.number()).describe('List of user IDs mentioned in the comment').optional(),
});

// Update comment input schema
export const UpdateCommentInputSchema = z.object({
  id: z.number().describe('Comment ID to update'),
  text: z.string().describe('Updated text content of the comment'),
});

// Delete comment params schema
export const DeleteCommentParamsSchema = z.object({
  id: z.number().describe('Comment ID to delete'),
});

// Add comment reaction input schema
export const AddCommentReactionInputSchema = z.object({
  id: z.number().describe('Comment ID to react to'),
  emoji: z.string().describe('Emoji reaction (e.g., "👍")'),
});

// Inferred types
export type CommentId = z.infer<typeof CommentIdSchema>;
export type ListCommentsParams = z.infer<typeof ListCommentsParamsSchema>;
export type CreateCommentInput = z.infer<typeof CreateCommentInputSchema>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentInputSchema>;
export type DeleteCommentParams = z.infer<typeof DeleteCommentParamsSchema>;
export type AddCommentReactionInput = z.infer<typeof AddCommentReactionInputSchema>;
