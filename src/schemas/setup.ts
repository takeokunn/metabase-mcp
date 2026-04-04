import { z } from 'zod';

export const CreateSetupInputSchema = z.object({
  token: z.string().describe('Setup token from GET /api/setup/token'),
  user: z.record(z.unknown()).describe('Initial admin user details'),
  prefs: z.record(z.unknown()).optional().describe('Site preferences'),
  database: z.record(z.unknown()).optional().describe('Initial database to connect'),
});
export type CreateSetupInput = z.infer<typeof CreateSetupInputSchema>;
