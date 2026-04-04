import { z } from 'zod';

export const PremiumTokenSchema = z.object({
  token: z.string().describe('Premium license token string'),
});
export type PremiumToken = z.infer<typeof PremiumTokenSchema>;
