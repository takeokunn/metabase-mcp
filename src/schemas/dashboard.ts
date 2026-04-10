import { z } from 'zod';
import { IdSchema, UUIDSchema } from './common';

// Dashboard ID schema
export const DashboardIdSchema = IdSchema;

// Dashcard ID schema (can be negative for new cards in v0.49+)
export const DashcardIdSchema = z
  .number()
  .int()
  .describe('Dashboard card ID (negative for new cards)');

// Dashboard Tab ID schema (can be negative for new tabs, -2 is magic ID for new tab)
export const DashboardTabIdSchema = z.number().int().describe('Dashboard tab ID (-2 for new tab)');

// Dashboard parameter schema
export const DashboardParameterSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().optional(),
  type: z.string(),
  default: z.unknown().optional(),
});

// Parameter mapping schema for dashcards
export const ParameterMappingSchema = z.object({
  parameter_id: z.string().describe('Parameter ID from dashboard'),
  card_id: z.number().int().positive().optional().describe('Card ID'),
  target: z.array(z.unknown()).optional().describe('Target field/dimension'),
});

// Visualization settings schema (flexible object for card-specific settings)
export const VisualizationSettingsSchema = z
  .record(z.string(), z.unknown())
  .describe('Card-specific visualization settings');

// Dashboard tab schema
export const DashboardTabSchema = z.object({
  id: DashboardTabIdSchema.describe('Tab ID'),
  name: z.string().min(1).describe('Tab display name'),
  position: z.number().int().nonnegative().optional().describe('Tab position (0-indexed)'),
});

// Dashcard schema (card embedded in dashboard)
export const DashcardSchema = z.object({
  id: DashcardIdSchema.describe('Dashcard ID'),
  card_id: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe('Card ID (null for text/virtual cards)'),
  dashboard_id: DashboardIdSchema.optional().describe('Parent dashboard ID'),
  dashboard_tab_id: DashboardTabIdSchema.nullable()
    .optional()
    .describe('Tab ID (null for default tab)'),
  row: z.number().int().nonnegative().describe('Row position (0-indexed)'),
  col: z.number().int().nonnegative().describe('Column position (0-indexed)'),
  size_x: z.number().int().positive().describe('Width in grid units'),
  size_y: z.number().int().positive().describe('Height in grid units'),
  parameter_mappings: z
    .array(ParameterMappingSchema)
    .optional()
    .describe('Filter parameter mappings'),
  visualization_settings: VisualizationSettingsSchema.optional().describe(
    'Card-specific visualization settings',
  ),
  series: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe('Series data for multi-series cards'),
  action_id: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe('Action ID for action cards'),
});

// Virtual card schema (for text boxes, headings, etc.)
export const VirtualCardSchema = z.object({
  name: z.string().nullable().optional(),
  display: z.enum(['text', 'heading', 'link', 'action']).describe('Virtual card display type'),
  visualization_settings: VisualizationSettingsSchema.optional(),
});

// Dashboard revision schema
export const DashboardRevisionSchema = z.object({
  id: z.number().int().positive().describe('Revision ID'),
  dashboard_id: DashboardIdSchema.describe('Dashboard ID'),
  user: z
    .object({
      id: z.number().int().positive(),
      common_name: z.string().optional(),
      email: z.string().email().optional(),
    })
    .optional()
    .describe('User who created the revision'),
  is_creation: z.boolean().optional().describe('Whether this is the initial creation'),
  is_reversion: z.boolean().optional().describe('Whether this is a reversion'),
  message: z.string().nullable().optional().describe('Revision message'),
  timestamp: z.string().datetime().optional().describe('Revision timestamp'),
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

// ---------------------------------------------------------------------------
// Dashcard Management Schemas (v0.49+: uses PUT /api/dashboard/:id/cards)
// ---------------------------------------------------------------------------

// Add dashboard card input schema
export const AddDashboardCardInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID to add card to'),
  card_id: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe('Card ID (null for text/virtual cards)'),
  row: z.number().int().nonnegative().describe('Row position (0-indexed)'),
  col: z.number().int().nonnegative().describe('Column position (0-indexed)'),
  size_x: z.number().int().positive().default(4).describe('Width in grid units'),
  size_y: z.number().int().positive().default(3).describe('Height in grid units'),
  dashboard_tab_id: DashboardTabIdSchema.nullable()
    .optional()
    .describe('Tab ID (null for default tab)'),
  parameter_mappings: z
    .array(ParameterMappingSchema)
    .optional()
    .describe('Filter parameter mappings'),
  visualization_settings: VisualizationSettingsSchema.optional().describe('Visualization settings'),
  virtual_card: VirtualCardSchema.optional().describe('Virtual card config for text/heading cards'),
});

// Update dashboard card input schema
export const UpdateDashboardCardInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID'),
  dashcard_id: z.number().int().positive().describe('Dashboard card ID to update'),
  row: z.number().int().nonnegative().optional().describe('New row position'),
  col: z.number().int().nonnegative().optional().describe('New column position'),
  size_x: z.number().int().positive().optional().describe('New width in grid units'),
  size_y: z.number().int().positive().optional().describe('New height in grid units'),
  dashboard_tab_id: DashboardTabIdSchema.nullable().optional().describe('Move to different tab'),
  parameter_mappings: z
    .array(ParameterMappingSchema)
    .optional()
    .describe('Updated parameter mappings'),
  visualization_settings: VisualizationSettingsSchema.optional().describe(
    'Updated visualization settings',
  ),
});

// Remove dashboard card input schema
export const RemoveDashboardCardInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID'),
  dashcard_id: z.number().int().positive().describe('Dashboard card ID to remove'),
});

// Bulk update dashboard cards input schema
export const UpdateDashboardCardsInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID'),
  cards: z
    .array(
      z.object({
        id: DashcardIdSchema.describe('Dashcard ID (negative for new cards)'),
        card_id: z.number().int().positive().nullable().optional().describe('Card ID'),
        row: z.number().int().nonnegative().describe('Row position'),
        col: z.number().int().nonnegative().describe('Column position'),
        size_x: z.number().int().positive().describe('Width'),
        size_y: z.number().int().positive().describe('Height'),
        dashboard_tab_id: DashboardTabIdSchema.nullable().optional().describe('Tab ID'),
        parameter_mappings: z.array(ParameterMappingSchema).optional(),
        visualization_settings: VisualizationSettingsSchema.optional(),
      }),
    )
    .min(1)
    .describe('Array of dashcards to update'),
});

// ---------------------------------------------------------------------------
// Dashboard Tab Schemas
// ---------------------------------------------------------------------------

// Add dashboard tab input schema
export const AddDashboardTabInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID to add tab to'),
  name: z.string().min(1).describe('Tab display name'),
});

// Update dashboard tab input schema
export const UpdateDashboardTabInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID'),
  tab_id: DashboardTabIdSchema.describe('Tab ID to update'),
  name: z.string().min(1).optional().describe('New tab name'),
  position: z.number().int().nonnegative().optional().describe('New tab position'),
});

// Remove dashboard tab input schema
export const RemoveDashboardTabInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID'),
  tab_id: DashboardTabIdSchema.describe('Tab ID to remove'),
});

// ---------------------------------------------------------------------------
// Public Sharing Schemas
// ---------------------------------------------------------------------------

// Create public link input schema
export const CreateDashboardPublicLinkInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID to share publicly'),
});

// Delete public link input schema
export const DeleteDashboardPublicLinkInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID to remove public link from'),
});

// List public dashboards params schema (superuser only)
export const ListPublicDashboardsParamsSchema = z.object({});

// Public link response schema
export const DashboardPublicLinkSchema = z.object({
  uuid: UUIDSchema.describe('Public link UUID'),
});

// ---------------------------------------------------------------------------
// Favorites Schemas
// ---------------------------------------------------------------------------

// Add favorite input schema
export const AddDashboardFavoriteInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID to favorite'),
});

// Remove favorite input schema
export const RemoveDashboardFavoriteInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID to unfavorite'),
});

// ---------------------------------------------------------------------------
// Revision Schemas
// ---------------------------------------------------------------------------

// List revisions params schema
export const ListDashboardRevisionsParamsSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID to get revisions for'),
});

// Revert dashboard input schema
export const RevertDashboardInputSchema = z.object({
  dashboard_id: DashboardIdSchema.describe('Dashboard ID to revert'),
  revision_id: z.number().int().positive().describe('Revision ID to revert to'),
});

// Inferred types - Core
export type DashboardId = z.infer<typeof DashboardIdSchema>;
export type DashcardId = z.infer<typeof DashcardIdSchema>;
export type DashboardTabId = z.infer<typeof DashboardTabIdSchema>;
export type DashboardParameter = z.infer<typeof DashboardParameterSchema>;
export type ParameterMapping = z.infer<typeof ParameterMappingSchema>;
export type VisualizationSettings = z.infer<typeof VisualizationSettingsSchema>;
export type DashboardTab = z.infer<typeof DashboardTabSchema>;
export type Dashcard = z.infer<typeof DashcardSchema>;
export type VirtualCard = z.infer<typeof VirtualCardSchema>;
export type DashboardRevision = z.infer<typeof DashboardRevisionSchema>;
export type Dashboard = z.infer<typeof DashboardSchema>;

// Inferred types - Basic Dashboard Operations
export type ListDashboardsParams = z.infer<typeof ListDashboardsParamsSchema>;
export type GetDashboardParams = z.infer<typeof GetDashboardParamsSchema>;
export type CreateDashboardInput = z.infer<typeof CreateDashboardInputSchema>;
export type UpdateDashboardInput = z.infer<typeof UpdateDashboardInputSchema>;
export type DeleteDashboardInput = z.infer<typeof DeleteDashboardInputSchema>;
export type CopyDashboardInput = z.infer<typeof CopyDashboardInputSchema>;

// Inferred types - Dashcard Management
export type AddDashboardCardInput = z.infer<typeof AddDashboardCardInputSchema>;
export type UpdateDashboardCardInput = z.infer<typeof UpdateDashboardCardInputSchema>;
export type RemoveDashboardCardInput = z.infer<typeof RemoveDashboardCardInputSchema>;
export type UpdateDashboardCardsInput = z.infer<typeof UpdateDashboardCardsInputSchema>;

// Inferred types - Tab Management
export type AddDashboardTabInput = z.infer<typeof AddDashboardTabInputSchema>;
export type UpdateDashboardTabInput = z.infer<typeof UpdateDashboardTabInputSchema>;
export type RemoveDashboardTabInput = z.infer<typeof RemoveDashboardTabInputSchema>;

// Inferred types - Public Sharing
export type CreateDashboardPublicLinkInput = z.infer<typeof CreateDashboardPublicLinkInputSchema>;
export type DeleteDashboardPublicLinkInput = z.infer<typeof DeleteDashboardPublicLinkInputSchema>;
export type ListPublicDashboardsParams = z.infer<typeof ListPublicDashboardsParamsSchema>;
export type DashboardPublicLink = z.infer<typeof DashboardPublicLinkSchema>;

// Inferred types - Favorites
export type AddDashboardFavoriteInput = z.infer<typeof AddDashboardFavoriteInputSchema>;
export type RemoveDashboardFavoriteInput = z.infer<typeof RemoveDashboardFavoriteInputSchema>;

// Inferred types - Revisions
export type ListDashboardRevisionsParams = z.infer<typeof ListDashboardRevisionsParamsSchema>;
export type RevertDashboardInput = z.infer<typeof RevertDashboardInputSchema>;

// ---------------------------------------------------------------------------
// Query Execution & Export Schemas
// ---------------------------------------------------------------------------

// Execute dashboard card query input schema
export const ExecuteDashboardCardQueryInputSchema = z.object({
  id: DashboardIdSchema.describe('Dashboard ID'),
  dashcard_id: z.number().int().positive().describe('Dashboard card ID'),
  card_id: z.number().int().positive().describe('Card ID to execute'),
  parameters: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe('Dashboard filter parameters to apply to the query'),
});

// Export dashboard card query input schema
export const ExportDashboardCardQueryInputSchema = z.object({
  id: DashboardIdSchema.describe('Dashboard ID'),
  dashcard_id: z.number().int().positive().describe('Dashboard card ID'),
  card_id: z.number().int().positive().describe('Card ID to export'),
  export_format: z
    .enum(['csv', 'json', 'xlsx', 'pdf'])
    .describe('Export format: csv, json, xlsx, or pdf'),
  parameters: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe('Dashboard filter parameters to apply to the query'),
});

// Get dashboard param values params schema
export const GetDashboardParamValuesParamsSchema = z.object({
  id: DashboardIdSchema.describe('Dashboard ID'),
  param_key: z.string().describe('Parameter key (slug) to retrieve values for'),
});

// Search dashboard param values params schema
export const SearchDashboardParamValuesParamsSchema = z.object({
  id: DashboardIdSchema.describe('Dashboard ID'),
  param_key: z.string().describe('Parameter key (slug) to search values for'),
  query: z.string().describe('Search query string to filter parameter values'),
});

// Get dashboard field values params schema
export const GetDashboardFieldValuesParamsSchema = z.object({
  id: DashboardIdSchema.describe('Dashboard ID'),
  field_id: z.number().int().positive().describe('Field ID to retrieve values for'),
});

// Search dashboard field values params schema
export const SearchDashboardFieldValuesParamsSchema = z.object({
  id: DashboardIdSchema.describe('Dashboard ID'),
  field_id: z.number().int().positive().describe('Field ID to search values for'),
  search_value: z.string().describe('Search string to filter field values'),
});

// Inferred types - Query Execution & Export
export type ExecuteDashboardCardQueryInput = z.infer<typeof ExecuteDashboardCardQueryInputSchema>;
export type ExportDashboardCardQueryInput = z.infer<typeof ExportDashboardCardQueryInputSchema>;
export type GetDashboardParamValuesParams = z.infer<typeof GetDashboardParamValuesParamsSchema>;
export type SearchDashboardParamValuesParams = z.infer<
  typeof SearchDashboardParamValuesParamsSchema
>;
export type GetDashboardFieldValuesParams = z.infer<typeof GetDashboardFieldValuesParamsSchema>;
export type SearchDashboardFieldValuesParams = z.infer<
  typeof SearchDashboardFieldValuesParamsSchema
>;

// ---------------------------------------------------------------------------
// New Dashboard Input Schemas
// ---------------------------------------------------------------------------

// Get dashboard param values input schema
export const GetDashboardParamValuesInputSchema = z.object({
  id: z.number().describe('The dashboard ID'),
  param_key: z.string().describe('The parameter key'),
});

// Search dashboard param values input schema
export const SearchDashboardParamValuesInputSchema = z.object({
  id: z.number().describe('The dashboard ID'),
  param_key: z.string().describe('The parameter key'),
  query: z.string().describe('The search query'),
});

// Get dashboard param remapping input schema
export const GetDashboardParamRemappingInputSchema = z.object({
  id: z.number().describe('The dashboard ID'),
  param_key: z.string().describe('The parameter key'),
});

// Get dashboard related input schema
export const GetDashboardRelatedInputSchema = z.object({
  id: z.number().describe('The dashboard ID'),
});

// Get valid filter fields input schema
export const GetValidFilterFieldsInputSchema = z.object({
  filtered: z.array(z.number()).describe('Array of field IDs to filter'),
  filtering: z.array(z.number()).describe('Array of field IDs doing the filtering'),
});

// Save dashboard input schema
export const SaveDashboardInputSchema = z.object({
  dashboard: z.record(z.string(), z.unknown()).describe('Dashboard object to save'),
});

// Save dashboard to collection input schema
export const SaveDashboardToCollectionInputSchema = z.object({
  parent_collection_id: z.number().describe('The parent collection ID'),
  dashboard: z.record(z.string(), z.unknown()).describe('Dashboard object to save'),
});

// Get dashboard items input schema
export const GetDashboardItemsInputSchema = z.object({
  id: z.number().describe('The dashboard ID'),
});

// Get dashcard action params input schema
export const GetDashcardActionParamsInputSchema = z.object({
  dashboard_id: z.number().describe('The dashboard ID'),
  dashcard_id: z.number().describe('The dashcard ID'),
  parameters: z.record(z.string(), z.unknown()).optional().describe('Parameter values'),
});

// Run dashcard query input schema
export const RunDashcardQueryInputSchema = z.object({
  dashboard_id: z.number().describe('The dashboard ID'),
  dashcard_id: z.number().describe('The dashcard ID'),
  card_id: z.number().describe('The card ID'),
  parameters: z.array(z.record(z.string(), z.unknown())).optional().describe('Parameter values'),
});

// Export dashcard query input schema
export const ExportDashcardQueryInputSchema = z.object({
  dashboard_id: z.number().describe('The dashboard ID'),
  dashcard_id: z.number().describe('The dashcard ID'),
  card_id: z.number().describe('The card ID'),
  export_format: z.enum(['csv', 'json', 'xlsx']).describe('Export format'),
  parameters: z.array(z.record(z.string(), z.unknown())).optional().describe('Parameter values'),
});

// Execute dashcard action input schema
export const ExecuteDashcardActionInputSchema = z.object({
  dashboard_id: z.number().describe('The dashboard ID'),
  dashcard_id: z.number().describe('The dashcard ID'),
  parameters: z.record(z.string(), z.unknown()).describe('Action parameters'),
});

// Pivot dashcard query input schema
export const PivotDashcardQueryInputSchema = z.object({
  dashboard_id: z.number().describe('The dashboard ID'),
  dashcard_id: z.number().describe('The dashcard ID'),
  card_id: z.number().describe('The card ID'),
  parameters: z.array(z.record(z.string(), z.unknown())).optional().describe('Parameter values'),
});

// Inferred types - New Dashboard Input Schemas
export type GetDashboardParamValuesInput = z.infer<typeof GetDashboardParamValuesInputSchema>;
export type SearchDashboardParamValuesInput = z.infer<typeof SearchDashboardParamValuesInputSchema>;
export type GetDashboardParamRemappingInput = z.infer<typeof GetDashboardParamRemappingInputSchema>;
export type GetDashboardRelatedInput = z.infer<typeof GetDashboardRelatedInputSchema>;
export type GetValidFilterFieldsInput = z.infer<typeof GetValidFilterFieldsInputSchema>;
export type SaveDashboardInput = z.infer<typeof SaveDashboardInputSchema>;
export type SaveDashboardToCollectionInput = z.infer<typeof SaveDashboardToCollectionInputSchema>;
export type GetDashboardItemsInput = z.infer<typeof GetDashboardItemsInputSchema>;
export type GetDashcardActionParamsInput = z.infer<typeof GetDashcardActionParamsInputSchema>;
export type RunDashcardQueryInput = z.infer<typeof RunDashcardQueryInputSchema>;
export type ExportDashcardQueryInput = z.infer<typeof ExportDashcardQueryInputSchema>;
export type ExecuteDashcardActionInput = z.infer<typeof ExecuteDashcardActionInputSchema>;
export type PivotDashcardQueryInput = z.infer<typeof PivotDashcardQueryInputSchema>;
