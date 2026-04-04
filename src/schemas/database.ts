import { z } from 'zod';
import { createPaginatedResponseSchema, IdSchema } from './common';

// Database ID schema
export const DatabaseIdSchema = IdSchema;

// Database engine enum
export const DatabaseEngineSchema = z.enum([
  'postgres',
  'mysql',
  'h2',
  'bigquery',
  'redshift',
  'snowflake',
  'sqlserver',
  'sqlite',
  'oracle',
  'mongo',
  'presto',
  'sparksql',
  'athena',
  'druid',
  'clickhouse',
  'googleanalytics',
  'starburst',
  'databricks',
]);

// Database schema
export const DatabaseSchema = z.object({
  id: DatabaseIdSchema,
  name: z.string().min(1),
  engine: DatabaseEngineSchema,
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// List databases response schema
export const ListDatabasesResponseSchema = createPaginatedResponseSchema(DatabaseSchema);

// Get database params schema
export const GetDatabaseParamsSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID'),
});

// List database tables params schema
export const ListDatabaseTablesParamsSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID'),
  schema: z.string().optional().describe('Filter by database schema name'),
});

// Create database input schema
export const CreateDatabaseInputSchema = z.object({
  name: z.string().min(1).describe('Database display name'),
  engine: DatabaseEngineSchema.describe('Database engine type (e.g., postgres, mysql)'),
  details: z
    .record(z.unknown())
    .optional()
    .describe('Connection details specific to the database engine'),
});

// Update database input schema
export const UpdateDatabaseInputSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID to update'),
  name: z.string().min(1).optional().describe('New database display name'),
  engine: DatabaseEngineSchema.optional().describe('New database engine type'),
  details: z.record(z.unknown()).optional().describe('Updated connection details'),
});

// Delete database input schema
export const DeleteDatabaseInputSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID to delete'),
});

// Database ID input schema (for operations requiring only an ID)
export const DatabaseIdInputSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID'),
});

// Validate database input schema
export const ValidateDatabaseInputSchema = z.object({
  engine: z.string().describe('Database engine type (e.g., postgres, mysql)'),
  details: z.record(z.unknown()).describe('Connection details specific to the database engine'),
});

// Get database fields params schema
export const GetDatabaseFieldsParamsSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID'),
});

// Get database ID fields params schema
export const GetDatabaseIdFieldsParamsSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID'),
  include_editable_data_model: z
    .boolean()
    .optional()
    .describe('Include fields only accessible via editable data model'),
});

// Get database autocomplete params schema
export const GetDatabaseAutocompleteParamsSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID'),
  prefix: z.string().optional().describe('Prefix string to search for autocomplete suggestions'),
  substring: z.string().optional().describe('Substring to search for autocomplete suggestions'),
});

// Sync database schema params schema (reuses GetDatabaseParamsSchema shape)
export const SyncDatabaseSchemaParamsSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID'),
});

// Delete database schema params schema
export const DeleteDatabaseSchemaParamsSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID'),
  schema: z.string().describe('Schema name to delete'),
});

// Get database virtual schema params schema
export const GetDatabaseVirtualSchemaParamsSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID'),
  schema: z.string().describe('Virtual schema name'),
});

// Upload CSV to database input schema
export const UploadCsvToDatabaseInputSchema = z.object({
  id: DatabaseIdSchema.describe('Database ID to upload CSV into'),
  table_name: z.string().describe('Name of the table to create from the CSV'),
  schema_name: z.string().optional().describe('Schema name to create the table in'),
  collection_id: z.number().optional().describe('Collection ID to associate the new table with'),
});

// Inferred types
export type DatabaseId = z.infer<typeof DatabaseIdSchema>;
export type DatabaseEngine = z.infer<typeof DatabaseEngineSchema>;
export type Database = z.infer<typeof DatabaseSchema>;
export type ListDatabasesResponse = z.infer<typeof ListDatabasesResponseSchema>;
export type GetDatabaseParams = z.infer<typeof GetDatabaseParamsSchema>;
export type ListDatabaseTablesParams = z.infer<typeof ListDatabaseTablesParamsSchema>;
export type CreateDatabaseInput = z.infer<typeof CreateDatabaseInputSchema>;
export type UpdateDatabaseInput = z.infer<typeof UpdateDatabaseInputSchema>;
export type DeleteDatabaseInput = z.infer<typeof DeleteDatabaseInputSchema>;
export type DatabaseIdInput = z.infer<typeof DatabaseIdInputSchema>;
export type ValidateDatabaseInput = z.infer<typeof ValidateDatabaseInputSchema>;
export type GetDatabaseFieldsParams = z.infer<typeof GetDatabaseFieldsParamsSchema>;
export type GetDatabaseIdFieldsParams = z.infer<typeof GetDatabaseIdFieldsParamsSchema>;
export type GetDatabaseAutocompleteParams = z.infer<typeof GetDatabaseAutocompleteParamsSchema>;
export type SyncDatabaseSchemaParams = z.infer<typeof SyncDatabaseSchemaParamsSchema>;
export type DeleteDatabaseSchemaParams = z.infer<typeof DeleteDatabaseSchemaParamsSchema>;
export type GetDatabaseVirtualSchemaParams = z.infer<typeof GetDatabaseVirtualSchemaParamsSchema>;
export type UploadCsvToDatabaseInput = z.infer<typeof UploadCsvToDatabaseInputSchema>;
