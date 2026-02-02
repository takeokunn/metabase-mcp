import { z } from 'zod';
import { IdSchema } from './common';

// Dashboard ID schema
export const DashboardIdSchema = IdSchema;

// Dashboard parameter schema
export const DashboardParameterSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().optional(),
  type: z.string(),
  default: z.unknown().optional(),
});

// Dashboard schema
export const DashboardSchema = z.object({
  id: DashboardIdSchema,
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  collection_id: z.number().int().nullable().optional(),
  parameters: z.array(DashboardParameterSchema).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// List dashboards params schema
// Note: Metabase's GET /api/dashboard does not support collection filtering.
// Use get_collection_items with models: ["dashboard"] to filter by collection.
export const ListDashboardsParamsSchema = z.object({});

// Get dashboard params schema
export const GetDashboardParamsSchema = z.object({
  id: DashboardIdSchema.describe('Dashboard ID'),
});

// Create dashboard input schema
export const CreateDashboardInputSchema = z.object({
  name: z.string().min(1).describe('Dashboard display name'),
  description: z.string().optional().describe('Dashboard description'),
  collection_id: z.number().int().optional().describe('Collection ID to save the dashboard in'),
  parameters: z.array(DashboardParameterSchema).optional().describe('Dashboard filter parameters'),
});

// Update dashboard input schema
export const UpdateDashboardInputSchema = z.object({
  id: DashboardIdSchema.describe('Dashboard ID to update'),
  name: z.string().min(1).optional().describe('New dashboard display name'),
  description: z.string().optional().describe('New dashboard description'),
  collection_id: z
    .number()
    .int()
    .nullable()
    .optional()
    .describe('Move dashboard to a different collection'),
});

// Delete dashboard input schema
export const DeleteDashboardInputSchema = z.object({
  id: DashboardIdSchema.describe('Dashboard ID to delete'),
});

// Copy dashboard input schema
export const CopyDashboardInputSchema = z.object({
  id: DashboardIdSchema.describe('Dashboard ID to copy'),
  name: z.string().optional().describe('Name for the copied dashboard'),
  collection_id: z.number().int().optional().describe('Collection ID for the copied dashboard'),
});

// Inferred types
export type DashboardId = z.infer<typeof DashboardIdSchema>;
export type DashboardParameter = z.infer<typeof DashboardParameterSchema>;
export type Dashboard = z.infer<typeof DashboardSchema>;
export type ListDashboardsParams = z.infer<typeof ListDashboardsParamsSchema>;
export type GetDashboardParams = z.infer<typeof GetDashboardParamsSchema>;
export type CreateDashboardInput = z.infer<typeof CreateDashboardInputSchema>;
export type UpdateDashboardInput = z.infer<typeof UpdateDashboardInputSchema>;
export type DeleteDashboardInput = z.infer<typeof DeleteDashboardInputSchema>;
export type CopyDashboardInput = z.infer<typeof CopyDashboardInputSchema>;
