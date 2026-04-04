import { z } from 'zod';

// Notify database sync by ID input schema
export const NotifyDatabaseSyncInputSchema = z.object({
  id: z.number().int().positive().describe('Database ID to notify sync for'),
  table_name: z.string().optional().describe('Specific table name to sync'),
  synchronous: z.boolean().optional().describe('Whether to perform sync synchronously'),
});

// Notify database sync by name input schema
export const NotifyDatabaseSyncByNameInputSchema = z.object({
  engine: z.string().describe('Database engine type (e.g. postgres, mysql)'),
  database_name: z.string().describe('Name of the database to sync'),
  table_name: z.string().optional().describe('Specific table name to sync'),
  synchronous: z.boolean().optional().describe('Whether to perform sync synchronously'),
});

// Notify Slack event input schema
export const NotifySlackEventInputSchema = z.record(z.unknown()).describe('Slack event payload');

// Inferred types
export type NotifyDatabaseSyncInput = z.infer<typeof NotifyDatabaseSyncInputSchema>;
export type NotifyDatabaseSyncByNameInput = z.infer<typeof NotifyDatabaseSyncByNameInputSchema>;
export type NotifySlackEventInput = z.infer<typeof NotifySlackEventInputSchema>;
