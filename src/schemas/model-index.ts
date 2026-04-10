import { z } from 'zod';
import { IdSchema } from './common';

// Model index ID schema (positive integer)
export const ModelIndexIdSchema = IdSchema;

// Get model index params schema
export const GetModelIndexParamsSchema = z.object({
  id: z.number().int().positive().describe('Model index ID'),
});

// Create model index input schema
export const CreateModelIndexInputSchema = z.object({
  model_id: z.number().int().positive().describe('Card/model ID'),
  pk_ref: z.record(z.string(), z.unknown()).describe('Primary key field reference'),
  value_ref: z.record(z.string(), z.unknown()).describe('Value field reference to index'),
});

// Delete model index params schema
export const DeleteModelIndexParamsSchema = z.object({
  id: z.number().int().positive().describe('Model index ID to delete'),
});

// Inferred types
export type ModelIndexId = z.infer<typeof ModelIndexIdSchema>;
export type GetModelIndexParams = z.infer<typeof GetModelIndexParamsSchema>;
export type CreateModelIndexInput = z.infer<typeof CreateModelIndexInputSchema>;
export type DeleteModelIndexParams = z.infer<typeof DeleteModelIndexParamsSchema>;
