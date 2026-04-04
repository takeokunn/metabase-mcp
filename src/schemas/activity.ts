import { z } from 'zod';

export const ListRecentsParamsSchema = z.object({
  context: z.string().optional().describe('Context filter (e.g., "views")'),
});

export type ListRecentsParams = z.infer<typeof ListRecentsParamsSchema>;
