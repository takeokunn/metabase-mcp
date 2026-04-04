import { z } from 'zod';

export const InitiateCloudMigrationInputSchema = z.object({
  store_api_key: z.string().describe('Metabase Store API key used to authenticate the migration'),
});
export type InitiateCloudMigrationInput = z.infer<typeof InitiateCloudMigrationInputSchema>;
