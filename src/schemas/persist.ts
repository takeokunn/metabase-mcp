import { z } from 'zod';
import { IdSchema } from './common';

// Persist ID schema (positive integer)
export const PersistIdSchema = IdSchema;

// Get persisted model params schema
export const GetPersistedModelParamsSchema = z.object({
  id: z.number().int().positive().describe('Persisted model ID'),
});

// Get card persisted model params schema
export const GetCardPersistedModelParamsSchema = z.object({
  card_id: z.number().int().positive().describe('Card ID to get persisted model for'),
});

// Persist card params schema
export const PersistCardParamsSchema = z.object({
  card_id: z.number().int().positive().describe('Card ID to enable persistence for'),
});

// Unpersist card params schema
export const UnpersistCardParamsSchema = z.object({
  card_id: z.number().int().positive().describe('Card ID to disable persistence for'),
});

// Refresh persisted model params schema
export const RefreshPersistedModelParamsSchema = z.object({
  card_id: z.number().int().positive().describe('Card ID to refresh persisted model for'),
});

// Set persist refresh schedule input schema
export const SetPersistRefreshScheduleInputSchema = z.object({
  schedule: z.string().describe('Cron expression for refresh schedule'),
});

// Persist database models params schema
export const PersistDatabaseModelsParamsSchema = z.object({
  db_id: z.number().int().positive().describe('Database ID to persist models for'),
});

// Unpersist database models params schema
export const UnpersistDatabaseModelsInputSchema = z.object({
  id: z.number().describe('Database ID'),
});

// Inferred types
export type PersistId = z.infer<typeof PersistIdSchema>;
export type GetPersistedModelParams = z.infer<typeof GetPersistedModelParamsSchema>;
export type GetCardPersistedModelParams = z.infer<typeof GetCardPersistedModelParamsSchema>;
export type PersistCardParams = z.infer<typeof PersistCardParamsSchema>;
export type UnpersistCardParams = z.infer<typeof UnpersistCardParamsSchema>;
export type RefreshPersistedModelParams = z.infer<typeof RefreshPersistedModelParamsSchema>;
export type SetPersistRefreshScheduleInput = z.infer<typeof SetPersistRefreshScheduleInputSchema>;
export type PersistDatabaseModelsParams = z.infer<typeof PersistDatabaseModelsParamsSchema>;
export type UnpersistDatabaseModelsInput = z.infer<typeof UnpersistDatabaseModelsInputSchema>;
