import { z } from 'zod';

// Upload CSV input schema (metadata; actual file upload is handled separately)
export const UploadCsvInputSchema = z.object({
  db_id: z.number().int().positive().describe('Target database ID'),
  table_name: z.string().describe('Name for the new table'),
  schema_name: z.string().optional().describe('Schema name for the new table'),
  collection_id: z.number().optional().describe('Collection ID to associate the upload with'),
});

// Inferred types
export type UploadCsvInput = z.infer<typeof UploadCsvInputSchema>;
