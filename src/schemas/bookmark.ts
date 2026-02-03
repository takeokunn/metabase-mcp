import { z } from 'zod';
import { IdSchema } from './common';

// Bookmark model type enum
export const BookmarkModelSchema = z
  .enum(['card', 'dashboard', 'collection'])
  .describe('Type of item to bookmark');

// Bookmark schema
export const BookmarkSchema = z.object({
  type: BookmarkModelSchema.describe('Type of bookmarked item'),
  item_id: IdSchema.describe('ID of the bookmarked item'),
  name: z.string().describe('Name of the bookmarked item'),
});

// List bookmarks params schema (no parameters required)
export const ListBookmarksParamsSchema = z.object({});

// Create bookmark input schema
export const CreateBookmarkInputSchema = z.object({
  model: BookmarkModelSchema.describe('Type of item to bookmark (card, dashboard, or collection)'),
  id: IdSchema.describe('ID of the item to bookmark'),
});

// Delete bookmark input schema
export const DeleteBookmarkInputSchema = z.object({
  model: BookmarkModelSchema.describe('Type of bookmarked item to remove'),
  id: IdSchema.describe('ID of the bookmarked item to remove'),
});

// Bookmark ordering item schema
export const BookmarkOrderingItemSchema = z.object({
  type: BookmarkModelSchema.describe('Type of bookmarked item'),
  item_id: IdSchema.describe('ID of the bookmarked item'),
});

// Reorder bookmarks input schema
export const ReorderBookmarksInputSchema = z.object({
  orderings: z
    .array(BookmarkOrderingItemSchema)
    .min(1)
    .describe('Array of bookmark orderings in the desired order'),
});

// Inferred types
export type BookmarkModel = z.infer<typeof BookmarkModelSchema>;
export type Bookmark = z.infer<typeof BookmarkSchema>;
export type ListBookmarksParams = z.infer<typeof ListBookmarksParamsSchema>;
export type CreateBookmarkInput = z.infer<typeof CreateBookmarkInputSchema>;
export type DeleteBookmarkInput = z.infer<typeof DeleteBookmarkInputSchema>;
export type BookmarkOrderingItem = z.infer<typeof BookmarkOrderingItemSchema>;
export type ReorderBookmarksInput = z.infer<typeof ReorderBookmarksInputSchema>;
