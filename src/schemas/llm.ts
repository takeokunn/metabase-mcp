import { z } from 'zod';

export const GenerateSqlInputSchema = z.object({
  question: z.string().describe('Natural language question to convert to SQL'),
  database_id: z.number().int().positive().describe('ID of the database to query'),
});
export type GenerateSqlInput = z.infer<typeof GenerateSqlInputSchema>;

export const ExtractTablesFromSqlInputSchema = z.object({
  database_id: z.number().int().positive().describe('ID of the database containing the SQL query'),
  sql: z.string().describe('SQL query to extract table references from'),
  template_tags: z
    .record(
      z.string(),
      z.object({ type: z.string(), 'card-id': z.number().int().positive().optional() }),
    )
    .optional()
    .describe('Optional native query template tags used to resolve card/model references'),
});
export type ExtractTablesFromSqlInput = z.infer<typeof ExtractTablesFromSqlInputSchema>;
