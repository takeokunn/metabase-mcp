import { z } from 'zod';

export const CacheStrategySchema = z
  .enum(['nocache', 'ttl', 'duration', 'schedule'])
  .describe('Cache strategy type');

export const UpdateCacheConfigInputSchema = z.object({
  model: z
    .enum(['root', 'database', 'dashboard', 'question'])
    .describe('The model type to configure caching for'),
  model_id: z.number().int().positive().describe('The ID of the model to configure caching for'),
  strategy: CacheStrategySchema.optional().describe('Cache strategy to apply'),
  config: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Additional strategy-specific configuration'),
});

export const InvalidateCacheInputSchema = z.object({
  model: z.string().optional().describe('The model type to invalidate cache for'),
  model_id: z.number().optional().describe('The ID of the model to invalidate cache for'),
});

export type CacheStrategy = z.infer<typeof CacheStrategySchema>;
export type UpdateCacheConfigInput = z.infer<typeof UpdateCacheConfigInputSchema>;
export type InvalidateCacheInput = z.infer<typeof InvalidateCacheInputSchema>;
