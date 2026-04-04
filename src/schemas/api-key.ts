import { z } from 'zod';
import { IdSchema } from './common';

export const ApiKeyIdSchema = IdSchema.describe('API key ID');

export const CreateApiKeyInputSchema = z.object({
  name: z.string().min(1).describe('Name of the API key'),
  group_id: z.number().int().positive().describe('ID of the permission group for the API key'),
});

export const UpdateApiKeyInputSchema = z.object({
  id: z.number().int().positive().describe('API key ID'),
  name: z.string().min(1).optional().describe('New name for the API key'),
});

export const DeleteApiKeyParamsSchema = z.object({
  id: z.number().int().positive().describe('API key ID'),
});

export const RegenerateApiKeyParamsSchema = z.object({
  id: z.number().int().positive().describe('API key ID'),
});

// Type exports
export type CreateApiKeyInput = z.infer<typeof CreateApiKeyInputSchema>;
export type UpdateApiKeyInput = z.infer<typeof UpdateApiKeyInputSchema>;
export type DeleteApiKeyParams = z.infer<typeof DeleteApiKeyParamsSchema>;
export type RegenerateApiKeyParams = z.infer<typeof RegenerateApiKeyParamsSchema>;
