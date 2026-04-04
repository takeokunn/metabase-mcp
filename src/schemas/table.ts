import { z } from 'zod';
import { IdSchema } from './common';

// Table ID schema
export const TableIdSchema = IdSchema;

// Table visibility type schema
export const TableVisibilityTypeSchema = z.enum(['normal', 'hidden', 'technical', 'cruft']);

// Table schema
export const TableSchema = z.object({
  id: TableIdSchema,
  name: z.string().min(1),
  display_name: z.string().optional(),
  description: z.string().nullable().optional(),
  db_id: z.number().int().positive(),
  schema: z.string().nullable().optional(),
  visibility_type: TableVisibilityTypeSchema.nullable().optional(),
  active: z.boolean().optional(),
});

// Get table params schema
export const GetTableParamsSchema = z.object({
  id: TableIdSchema.describe('Table ID'),
});

// Get table metadata params schema
export const GetTableMetadataParamsSchema = z.object({
  id: TableIdSchema.describe('Table ID'),
  include_hidden_fields: z.boolean().optional().describe('Include hidden fields in metadata'),
});

// Update table input schema
export const UpdateTableInputSchema = z.object({
  id: TableIdSchema.describe('Table ID to update'),
  display_name: z.string().optional().describe('New table display name'),
  description: z.string().nullable().optional().describe('Table description'),
  visibility_type: TableVisibilityTypeSchema.optional().describe(
    'Table visibility (normal, hidden, technical, cruft)',
  ),
});

// List table fields params schema
export const ListTableFieldsParamsSchema = z.object({
  id: TableIdSchema.describe('Table ID'),
});

// Table ID input schema (for operations requiring only an ID)
export const TableIdInputSchema = z.object({
  id: TableIdSchema.describe('Table ID'),
});

// Bulk update tables input schema
export const BulkUpdateTablesInputSchema = z.object({
  tables: z
    .array(z.record(z.unknown()))
    .describe('Array of table update objects, each must include an id field'),
});

// Append CSV to table input schema
export const AppendCsvToTableInputSchema = z.object({
  id: TableIdSchema.describe('Table ID to append CSV data to'),
  file_name: z.string().describe('Name of the CSV file to append'),
});

// Update table fields order input schema
export const UpdateTableFieldsOrderInputSchema = z.object({
  id: TableIdSchema.describe('Table ID'),
  field_order: z
    .array(z.number().int().positive())
    .describe('Array of field IDs in the desired display order'),
});

// Get virtual card table FKs input schema
export const GetVirtualCardTableFksInputSchema = z.object({
  id: z.number().describe('Card ID for the virtual table'),
});

// Get virtual card table query metadata input schema
export const GetVirtualCardTableQueryMetadataInputSchema = z.object({
  id: z.number().describe('Card ID for the virtual table'),
});

// Get table data input schema
export const GetTableDataInputSchema = z.object({
  table_id: z.number().describe('The table ID'),
});

// Inferred types
export type TableId = z.infer<typeof TableIdSchema>;
export type TableVisibilityType = z.infer<typeof TableVisibilityTypeSchema>;
export type Table = z.infer<typeof TableSchema>;
export type GetTableParams = z.infer<typeof GetTableParamsSchema>;
export type GetTableMetadataParams = z.infer<typeof GetTableMetadataParamsSchema>;
export type UpdateTableInput = z.infer<typeof UpdateTableInputSchema>;
export type ListTableFieldsParams = z.infer<typeof ListTableFieldsParamsSchema>;
export type TableIdInput = z.infer<typeof TableIdInputSchema>;
export type BulkUpdateTablesInput = z.infer<typeof BulkUpdateTablesInputSchema>;
export type AppendCsvToTableInput = z.infer<typeof AppendCsvToTableInputSchema>;
export type UpdateTableFieldsOrderInput = z.infer<typeof UpdateTableFieldsOrderInputSchema>;
export type GetVirtualCardTableFksInput = z.infer<typeof GetVirtualCardTableFksInputSchema>;
export type GetVirtualCardTableQueryMetadataInput = z.infer<
  typeof GetVirtualCardTableQueryMetadataInputSchema
>;
export type GetTableDataInput = z.infer<typeof GetTableDataInputSchema>;
