import { z } from 'zod';

export const GenerateSqlInputSchema = z.object({
  question: z.string().describe('Natural language question to convert to SQL'),
  database_id: z.number().int().positive().describe('ID of the database to query'),
});
export type GenerateSqlInput = z.infer<typeof GenerateSqlInputSchema>;

export const ExtractTablesFromSqlInputSchema = z.object({
  sql: z.string().describe('SQL query to extract table references from'),
});
export type ExtractTablesFromSqlInput = z.infer<typeof ExtractTablesFromSqlInputSchema>;
