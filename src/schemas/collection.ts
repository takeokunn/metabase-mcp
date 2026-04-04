import { z } from 'zod';
import { IdSchema } from './common';

// Collection ID schema (positive integer or "root" string literal)
export const CollectionIdSchema = z.union([IdSchema, z.literal('root')]);

// Collection schema
export const CollectionSchema = z.object({
  id: CollectionIdSchema,
  name: z.string().min(1),
  description: z.string().nullish(),
  location: z.string().nullish(),
  personal_owner_id: z.number().int().positive().nullish(),
  archived: z.boolean().optional(),
});

// List collections params schema
export const ListCollectionsParamsSchema = z.object({
  namespace: z.string().optional().describe('Filter by collection namespace'),
});

// Get collection params schema
export const GetCollectionParamsSchema = z.object({
  id: CollectionIdSchema.describe('Collection ID or "root" for root collection'),
});

// Get collection items params schema
export const GetCollectionItemsParamsSchema = z.object({
  id: CollectionIdSchema.describe('Collection ID or "root" for root collection'),
  models: z.array(z.string()).optional().describe('Filter by item types (card, dashboard, etc.)'),
  limit: z.number().int().positive().optional().describe('Maximum number of items to return'),
  offset: z.number().int().nonnegative().optional().describe('Number of items to skip'),
});

// Create collection input schema
export const CreateCollectionInputSchema = z.object({
  name: z.string().min(1).describe('Collection display name'),
  description: z.string().optional().describe('Collection description'),
  parent_id: z.number().int().positive().optional().describe('Parent collection ID for nesting'),
  color: z.string().optional().describe('Collection color in hex format'),
});

// Update collection input schema
export const UpdateCollectionInputSchema = z.object({
  id: z.number().int().positive().describe('Collection ID to update'),
  name: z.string().min(1).optional().describe('New collection display name'),
  description: z.string().optional().describe('New collection description'),
  parent_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Move to a different parent collection'),
  archived: z.boolean().optional().describe('Archive or unarchive the collection'),
});

// Delete (archive) collection input schema
export const DeleteCollectionInputSchema = z.object({
  id: z.number().int().positive().describe('Collection ID to archive'),
});

// Get root collection items params schema
export const GetRootCollectionItemsParamsSchema = z.object({
  models: z.array(z.string()).optional().describe('Filter by item types (card, dashboard, etc.)'),
  limit: z.number().int().positive().optional().describe('Maximum number of items to return'),
  offset: z.number().int().nonnegative().optional().describe('Number of items to skip'),
});

// Hard delete collection input schema
export const HardDeleteCollectionInputSchema = z.object({
  id: z.number().int().positive().describe('Collection ID to permanently delete'),
});

// Restore collection input schema
export const RestoreCollectionInputSchema = z.object({
  id: z.number().int().positive().describe('Collection ID to restore from trash'),
});

// Move collection items input schema
export const MoveCollectionItemsInputSchema = z.object({
  source_collection_id: z.number().int().positive().describe('Source collection ID to move items from'),
  destination_collection_id: z
    .number()
    .int()
    .positive()
    .describe('Destination collection ID to move items into'),
  items: z
    .array(z.object({ id: z.number().describe('Item ID'), model: z.string().describe('Item model type (card, dashboard, etc.)') }))
    .describe('Array of items to move'),
});

// Get collection permission graph params schema
export const GetCollectionPermissionGraphParamsSchema = z.object({
  id: z.number().int().positive().describe('Collection ID to get permission graph for'),
});

// Inferred types
export type CollectionId = z.infer<typeof CollectionIdSchema>;
export type Collection = z.infer<typeof CollectionSchema>;
export type ListCollectionsParams = z.infer<typeof ListCollectionsParamsSchema>;
export type GetCollectionParams = z.infer<typeof GetCollectionParamsSchema>;
export type GetCollectionItemsParams = z.infer<typeof GetCollectionItemsParamsSchema>;
export type CreateCollectionInput = z.infer<typeof CreateCollectionInputSchema>;
export type UpdateCollectionInput = z.infer<typeof UpdateCollectionInputSchema>;
export type DeleteCollectionInput = z.infer<typeof DeleteCollectionInputSchema>;
export type GetRootCollectionItemsParams = z.infer<typeof GetRootCollectionItemsParamsSchema>;
export type HardDeleteCollectionInput = z.infer<typeof HardDeleteCollectionInputSchema>;
export type RestoreCollectionInput = z.infer<typeof RestoreCollectionInputSchema>;
export type MoveCollectionItemsInput = z.infer<typeof MoveCollectionItemsInputSchema>;
export type GetCollectionPermissionGraphParams = z.infer<typeof GetCollectionPermissionGraphParamsSchema>;
