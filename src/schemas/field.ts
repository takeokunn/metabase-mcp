import { z } from 'zod';

// Field semantic types
export const SemanticTypeSchema = z
  .enum([
    'type/PK',
    'type/FK',
    'type/Name',
    'type/Title',
    'type/Description',
    'type/Category',
    'type/State',
    'type/City',
    'type/Country',
    'type/ZipCode',
    'type/Email',
    'type/URL',
    'type/Number',
    'type/Quantity',
    'type/Cost',
    'type/Price',
    'type/Discount',
    'type/Score',
    'type/Percentage',
    'type/Duration',
    'type/CreationTimestamp',
    'type/UpdatedTimestamp',
    'type/CancelationTimestamp',
    'type/DeletionTimestamp',
    'type/Birthdate',
    'type/JoinTimestamp',
    'type/Latitude',
    'type/Longitude',
    'type/AvatarURL',
    'type/ImageURL',
  ])
  .describe('Semantic type for field interpretation');

export const FieldVisibilitySchema = z
  .enum(['normal', 'details-only', 'hidden', 'sensitive', 'retired'])
  .describe('Field visibility setting');

// Input schemas
export const GetFieldInputSchema = z.object({
  id: z.number().int().positive().describe('Field ID'),
});

export const UpdateFieldInputSchema = z.object({
  id: z.number().int().positive().describe('Field ID'),
  display_name: z.string().optional().describe('Display name for the field'),
  description: z.string().optional().describe('Field description'),
  semantic_type: SemanticTypeSchema.optional().describe('Semantic type'),
  visibility_type: FieldVisibilitySchema.optional().describe('Visibility setting'),
  fk_target_field_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Target field ID for foreign key'),
  coercion_strategy: z.string().optional().describe('Type coercion strategy'),
  has_field_values: z
    .enum(['none', 'list', 'search', 'auto-list'])
    .optional()
    .describe('Field values behavior'),
  settings: z.record(z.string(), z.unknown()).optional().describe('Field-specific settings'),
});

export const GetFieldValuesInputSchema = z.object({
  id: z.number().int().positive().describe('Field ID'),
});

export const UpdateFieldValuesInputSchema = z.object({
  id: z.number().int().positive().describe('Field ID'),
  values: z.array(z.array(z.unknown())).describe('Array of [value, human_readable_value] pairs'),
});

export const RescanFieldValuesInputSchema = z.object({
  id: z.number().int().positive().describe('Field ID'),
});

export const DiscardFieldValuesInputSchema = z.object({
  id: z.number().int().positive().describe('Field ID'),
});

export const GetFieldRelatedInputSchema = z.object({
  id: z.number().int().positive().describe('Field ID'),
});

export const SearchFieldValuesInputSchema = z.object({
  id: z.number().int().positive().describe('Field ID'),
  value: z.string().describe('Search value'),
  limit: z.number().int().positive().max(100).optional().describe('Maximum results to return'),
});

// Create field dimension input schema
export const CreateFieldDimensionInputSchema = z.object({
  id: z.number().int().positive().describe('Field ID'),
  type: z
    .enum(['external', 'internal'])
    .describe('Dimension type: external (remapping) or internal (FK lookup)'),
  name: z.string().describe('Display name for the dimension'),
  human_readable_field_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Field ID to use for human-readable values (required for external type)'),
});

// Field dimension params schema (for delete)
export const FieldDimensionParamsSchema = z.object({
  id: z.number().int().positive().describe('Field ID'),
});

// Update field remapping input schema
export const UpdateFieldRemappingInputSchema = z.object({
  id: z.number().int().positive().describe('Field ID'),
  values: z
    .array(z.array(z.unknown()))
    .describe('Array of [original_value, human_readable_value] pairs'),
});

// Get field remapping input schema
export const GetFieldRemappingInputSchema = z.object({
  id: z.number().describe('Source field ID'),
  remapped_id: z.number().describe('Target remapped field ID'),
});

// Get field summary input schema
export const GetFieldSummaryInputSchema = z.object({
  id: z.number().describe('The field ID'),
});

// Get field table IDs input schema
export const GetFieldTableIdsInputSchema = z.object({
  field_ids: z.array(z.number().int()).describe('List of Field IDs to resolve Table IDs for'),
});

// Type exports
export type GetFieldInput = z.infer<typeof GetFieldInputSchema>;
export type UpdateFieldInput = z.infer<typeof UpdateFieldInputSchema>;
export type GetFieldValuesInput = z.infer<typeof GetFieldValuesInputSchema>;
export type UpdateFieldValuesInput = z.infer<typeof UpdateFieldValuesInputSchema>;
export type RescanFieldValuesInput = z.infer<typeof RescanFieldValuesInputSchema>;
export type DiscardFieldValuesInput = z.infer<typeof DiscardFieldValuesInputSchema>;
export type GetFieldRelatedInput = z.infer<typeof GetFieldRelatedInputSchema>;
export type SearchFieldValuesInput = z.infer<typeof SearchFieldValuesInputSchema>;
export type CreateFieldDimensionInput = z.infer<typeof CreateFieldDimensionInputSchema>;
export type FieldDimensionParams = z.infer<typeof FieldDimensionParamsSchema>;
export type UpdateFieldRemappingInput = z.infer<typeof UpdateFieldRemappingInputSchema>;
export type GetFieldRemappingInput = z.infer<typeof GetFieldRemappingInputSchema>;
export type GetFieldSummaryInput = z.infer<typeof GetFieldSummaryInputSchema>;
export type GetFieldTableIdsInput = z.infer<typeof GetFieldTableIdsInputSchema>;
